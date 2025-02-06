import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("=== Начало обработки запроса ===");
  console.log("Метод запроса:", req.method);
  console.log("URL запроса:", req.url);
  console.log("Query:", req.query);
  console.log("Body:", req.body);

  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL;
  console.log("MOKKY_BASE_URL:", MOKKY_BASE_URL);

  if (!MOKKY_BASE_URL) {
    console.error("Ошибка: MOKKY_BASE_URL не задан!");
    return res.status(500).json({ error: "Переменная MOKKY_BASE_URL не задана" });
  }

  const { path } = req.query;
  if (!path || typeof path !== 'string') {
    console.error("Ошибка: Некорректный путь запроса:", req.query);
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

    console.log("Ответ от Mokky:", response.status, response.data);
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error("Ошибка запроса к Mokky:", error?.response?.status, error?.response?.data);
    res.status(500).json({ error: "Ошибка сервера", details: error?.response?.data });
  }
}
