import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL;

  if (!MOKKY_BASE_URL) {
    return res.status(500).json({ error: "Переменная MOKKY_BASE_URL не задана" });
  }

  const { path } = req.query;
  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: "Некорректный путь запроса" });
  }

  const url = `${MOKKY_BASE_URL}/${path}`;

  try {
    const response = await axios({
      method: req.method,
      url,
      headers: { 'Content-Type': 'application/json' },
      data: req.body
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: "Ошибка сервера", details: error?.response?.data });
  }
}
