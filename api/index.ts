import type { VercelRequest, VercelResponse } from '@vercel/node';
import rootRouter from './routers/root.router';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.url === '/api/virus-check' && req.method === 'POST') {
    const { scanner_controller } = await import(
      './controllers/scanner.controller'
    );
    return scanner_controller.checkUrl(req, res);
  }

  // Handle 404
  return res.status(404).json({ error: 'Not found' });
}
