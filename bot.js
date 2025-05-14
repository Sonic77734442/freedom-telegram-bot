const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const webAppUrl = 'https://freedom-test.vercel.app';

bot.onText(/\/start/, (msg) => {
  console.log("📩 /start от", msg.chat.username);

  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже, чтобы пройти тест:", {
    reply_markup: {
      inline_keyboard: [[{
        text: "🧪 Пройти тест",
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
