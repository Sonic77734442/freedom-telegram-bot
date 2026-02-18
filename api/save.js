// api/save.js
const crypto = require('node:crypto');
const { saveQuizSubmission } = require('../lib/db');

function isValidTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return false;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;

  params.delete('hash');
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const left = Buffer.from(computedHash, 'hex');
  const right = Buffer.from(hash, 'hex');
  if (left.length !== right.length) return false;

  return crypto.timingSafeEqual(left, right);
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'Server is not configured (BOT_TOKEN missing)' });
  }

  const data = req.body || {};
  const initData = data.init_data;

  if (!isValidTelegramInitData(initData, botToken)) {
    return res.status(401).json({ error: 'Invalid Telegram signature' });
  }

  const params = new URLSearchParams(initData);
  const userRaw = params.get('user');
  let telegramUser = null;

  if (userRaw) {
    try {
      telegramUser = JSON.parse(userRaw);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid Telegram user payload' });
    }
  }

  if (!telegramUser || !telegramUser.id) {
    return res.status(400).json({ error: 'Telegram user is missing in initData' });
  }

  const answers = data.answers || {};

  console.log('👉 Новый ответ от Telegram:', {
    user_id: telegramUser.id,
    username: telegramUser.username,
    first_name: telegramUser.first_name,
    answers,
  });

  try {
    await saveQuizSubmission({
      telegramUserId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      answers,
    });
  } catch (error) {
    console.error('Failed to save submission:', error);
    return res.status(500).json({ error: 'Failed to save submission' });
  }

  return res.status(200).json({ message: 'Данные успешно получены' });
}

module.exports = handler;
