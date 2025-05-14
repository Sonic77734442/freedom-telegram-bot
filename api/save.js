// api/save.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    console.log('👉 Новый ответ от Telegram:', data);

    // Здесь ты можешь сохранить данные в базу, Google Sheets, или куда нужно

    return res.status(200).json({ message: 'Данные успешно получены' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
