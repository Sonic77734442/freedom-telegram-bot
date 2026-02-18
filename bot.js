const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const botToken = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL || 'https://freedom-test.vercel.app';

if (!botToken) {
  console.error('BOT_TOKEN is required. Set BOT_TOKEN in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, (msg) => {
  console.log("📩 /start от", msg.chat.username);

  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже, чтобы пройти опрос PGbonus:", {
    reply_markup: {
      inline_keyboard: [[{
        text: "🧾 Зарегистрировать чек",
        web_app: { url: webAppUrl }
      }]]
    }
  });
});

app.get('/', (req, res) => {
  res.send('Бот работает');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 WebService для Render запущен на порту ${PORT}`);
});
