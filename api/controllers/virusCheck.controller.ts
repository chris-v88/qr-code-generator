import type { VercelRequest, VercelResponse } from '@vercel/node';
import { virusCheckService } from '../services/virusCheck.service';
import type { ApiResponse, VirusCheckResult } from '../types';

// Success response helper
const responseSuccess = <T>(
  data: T,
  message = 'Success',
  code = 200
): ApiResponse<T> => {
  return {
    status: 'success',
    statusCode: code,
    message,
    data,
  };
};

// Error response helper
const responseError = (
  error: any,
  message = 'Internal Server Error',
  code = 500,
  stack = null
): ApiResponse => {
  return {
    status: 'error',
    statusCode: code,
    message,
    error: error instanceof Error ? error.message : error,
    stack,
  };
};

export const virusCheckController = {
  checkUrl: async (req: VercelRequest, res: VercelResponse) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== 'string') {
        const response = responseError('URL is required', 'Bad Request', 400);
        return res.status(response.statusCode).json(response);
      }

      const result: VirusCheckResult = await virusCheckService.checkUrl(url);
      const response = responseSuccess(
        result,
        'URL safety check completed successfully'
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      console.error('Virus check controller error:', error);
      const response = responseError(
        error,
        error instanceof Error ? error.message : 'Virus check failed',
        500,
        process.env.NODE_ENV === 'development' ? (error as Error)?.stack : null
      );
      res.status(response.statusCode).json(response);
    }
  },
};
