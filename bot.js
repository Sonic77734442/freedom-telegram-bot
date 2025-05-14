const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

// Telegram bot
const bot = new TelegramBot(process.env.7683975860:AAGLVLjvQA7U3K3vB8DX3w4UUEXef76gimY, { polling: true });
const webAppUrl = 'https://freedom-test.vercel.app';

bot.onText(/\/start/, (msg) => {
  console.log("📩 /start от", msg.chat.username);
  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже, чтобы пройти тест:", {
    reply_markup: {
      keyboard: [[{
        text: "🧪 Пройти тест",
        web_app: { url: webAppUrl }
      }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// 🧠 Эмуляция веб-сервера для Render
app.get('/', (req, res) => {
  res.send('Бот работает');
});

// 🔥 Render требует открыт порт
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 WebService для Render запущен на порту ${PORT}`);
});
