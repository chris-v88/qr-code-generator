import fetch from 'node-fetch';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    console.error('VIRUSTOTAL_API_KEY environment variable not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Step 1: Submit URL for scanning
    const submitResponse = await fetch(
      'https://www.virustotal.com/api/v3/urls',
      {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      }
    );

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error('VirusTotal submit error:', errorText);
      return res.status(submitResponse.status).json({
        error: 'Failed to submit URL to VirusTotal',
      });
    }

    const submitData = await submitResponse.json();
    const analysisId = submitData.data.id;

    // Step 2: Poll for results (max 10 attempts, 2 seconds each)
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pollResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': apiKey },
        }
      );

      if (!pollResponse.ok) {
        console.error('VirusTotal poll error:', await pollResponse.text());
        continue;
      }

      const analysisData = await pollResponse.json();

      if (analysisData.data.attributes.status === 'completed') {
        result = analysisData;
        break;
      }
    }

    if (!result) {
      return res.status(408).json({
        error: 'Analysis timeout - please try again',
      });
    }

    const stats = result.data.attributes.stats;
    const isSafe = stats.malicious === 0;

    return res.status(200).json({
      isSafe,
      stats,
      analysisId,
    });
  } catch (error) {
    console.error('Virus check error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
