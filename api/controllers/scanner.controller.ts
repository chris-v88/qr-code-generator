import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Request, Response } from 'express';
import { scanner_service } from '../services/scanner.service';

// Success response helper (from your insta-photo pattern)
const responseSuccess = (data: any, message = 'Success', code = 200) => {
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
  code = 500
) => {
  return {
    status: 'error',
    statusCode: code,
    message,
    error: error instanceof Error ? error.message : error,
  };
};

export const scanner_controller = {
  // For Express Router
  checkUrl: async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== 'string') {
        const response = responseError('URL is required', 'Bad Request', 400);
        return res.status(response.statusCode).json(response);
      }

      const result = await scanner_service.checkUrl(url);
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
        500
      );
      res.status(response.statusCode).json(response);
    }
  },

  // For Vercel Serverless (without Express Router)
  checkUrlVercel: async (req: VercelRequest, res: VercelResponse) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== 'string') {
        const response = responseError('URL is required', 'Bad Request', 400);
        return res.status(response.statusCode).json(response);
      }

      const result = await scanner_service.checkUrl(url);
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
        500
      );
      res.status(response.statusCode).json(response);
    }
  },
};
