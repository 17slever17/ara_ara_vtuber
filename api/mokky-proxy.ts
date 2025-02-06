module.exports = async (req, res) => {
  // Секретные данные можно хранить в переменных окружения
  const MOKKY_BASE_URL = process.env.MOKKY_BASE_URL;
  const url = MOKKY_BASE_URL + req.url;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOKKY_API_KEY}`
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};