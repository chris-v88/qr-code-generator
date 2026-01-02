import { useMutation } from '@tanstack/react-query';

import {
  virusTotalSubmitSchema,
  virusTotalAnalysisSchema,
} from '../utils/types';

export const useVirusCheck = (options = {}) => {
  return useMutation({
    mutationFn: async (url: string): Promise<boolean> => {
      const apiKey = process.env.VIRUSTOTAL_API_KEY;

      if (!apiKey) {
        throw new Error('VirusTotal API key not set');
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
          throw new Error('Failed to submit URL');
        }

        const submitData = virusTotalSubmitSchema.parse(
          await submitResponse.json()
        );
        const analysisId = submitData.data.id;

        // Step 2: Poll for results
        let result;
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const pollResponse = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            {
              headers: { 'x-apikey': apiKey },
            }
          );

          if (!pollResponse.ok) {
            throw new Error('Failed to poll analysis');
          }

          const analysisData = virusTotalAnalysisSchema.parse(
            await pollResponse.json()
          );
          if (analysisData.data.attributes.status === 'completed') {
            result = analysisData;
            break;
          }
        }

        if (!result) {
          throw new Error('Analysis did not complete');
        }

        const stats = result.data.attributes.stats;
        return stats.malicious === 0;
      } catch (error) {
        throw new Error('VirusTotal check failed');
      }
    },
    ...options,
  });
};
