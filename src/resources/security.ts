import axios from 'axios';
import { sanitizeUrl } from '../utils/helpers'; // Import from helpers

// Function to check URL with VirusTotal
export const checkVirusTotal = async (url: string): Promise<boolean> => {
  const apiKey = process.env.REACT_APP_VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    console.error('VirusTotal API key not set');
    return false; // Skip check if no key
  }
  try {
    // Step 1: Submit URL for scanning
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const analysisId = submitResponse.data.data.id;

    // Step 2: Poll for results (simple poll, in production use webhooks)
    let result;
    for (let i = 0; i < 10; i++) {
      // Poll up to 10 times
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
      result = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': apiKey },
        }
      );
      if (result.data.data.attributes.status === 'completed') break;
    }

    // Check if malicious (VirusTotal has a 'malicious' count)
    const stats = result.data.data.attributes.stats;
    return stats.malicious === 0; // True if no malware detected
  } catch (error) {
    console.error('VirusTotal check failed:', error);
    return false; // Assume unsafe on error
  }
};

// Export sanitizeUrl for convenience
export { sanitizeUrl };
