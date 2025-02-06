import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL; // Указываем в Vercel
  const url = `${MOKKY_BASE_URL}${req.url?.replace('/api/mokky-proxy', '')}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      headers: { 'Content-Type': 'application/json' },
      data: req.body
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Ошибка запроса к Mokky:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
