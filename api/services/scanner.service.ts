import fetch from 'node-fetch';

export const scanner_service = {
  checkUrl: async (url: string) => {
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!apiKey) {
      throw new Error('VIRUSTOTAL_API_KEY environment variable not set');
    }

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
      throw new Error('Failed to submit URL to VirusTotal');
    }

    const submitData = await submitResponse.json();
    const analysisId = submitData.data.id;

    // Step 2: Poll for results
    let result = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pollResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers: { 'x-apikey': apiKey } }
      );

      if (!pollResponse.ok) continue;

      const analysisData = await pollResponse.json();

      if (analysisData.data.attributes.status === 'completed') {
        result = analysisData;
        break;
      }
    }

    if (!result) {
      throw new Error('Analysis timeout - please try again');
    }

    const stats = result.data.attributes.stats;
    const isSafe = stats.malicious === 0;

    return { isSafe, stats, analysisId };
  },
};
