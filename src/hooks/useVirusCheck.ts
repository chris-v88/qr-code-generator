import { useMutation } from '@tanstack/react-query';

export const useVirusCheck = (options = {}) => {
  return useMutation({
    mutationFn: async (url: string): Promise<boolean> => {
      try {
        // Call our serverless API endpoint instead of directly calling VirusTotal
        const response = await fetch('/api/virus-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to check URL safety');
        }

        const data = await response.json();
        return data.isSafe;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`VirusTotal check failed: ${error.message}`);
        }
        throw new Error('VirusTotal check failed');
      }
    },
    ...options,
  });
};
