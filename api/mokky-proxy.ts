import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	console.log('Начало обработки запроса:', req.method, req.url, req.query);
  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL;
  if (!MOKKY_BASE_URL) {
    console.error("MOKKY_BASE_URL не задана в переменных окружения");
    return res.status(500).json({ error: "Переменная MOKKY_BASE_URL не задана" });
  }

  const { path } = req.query;
  if (!path || typeof path !== 'string') {
    console.error("Некорректный путь запроса:", req.query);
    return res.status(400).json({ error: "Некорректный путь запроса" });
  }

  const url = `${MOKKY_BASE_URL}/${path}`;
  console.log(`Проксирование запроса: ${req.method} ${url}`);

  try {
    const response = await axios({
      method: req.method,
      url,
      headers: { 'Content-Type': 'application/json' },
      data: req.body
    });
    console.log(`Ответ от Mokky (статус ${response.status}):`, response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Ошибка запроса к Mokky:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
