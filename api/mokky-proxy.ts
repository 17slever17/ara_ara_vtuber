import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL;
  if (!MOKKY_BASE_URL) {
    return res.status(500).json({ error: 'MOKKY_BASE_URL не задан в переменных окружения' });
  }

  const url = `${MOKKY_BASE_URL}${req.url}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при запросе к Mokky' });
  }
}
