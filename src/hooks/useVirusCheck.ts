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
          throw new Error(
            errorData.error || errorData.message || 'Failed to check URL safety'
          );
        }

        const data = await response.json();

        // Handle the new MVC response format
        if (data.status === 'error') {
          throw new Error(data.error || data.message || 'Virus check failed');
        }

        // Extract the actual result from the data field
        return data.data?.isSafe ?? false;
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
