export interface VirusCheckResult {
  isSafe: boolean;
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
    confirmed_timeout: number;
    failure: number;
    type_unsupported: number;
  };
  analysisId: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  stack?: string | null;
}
