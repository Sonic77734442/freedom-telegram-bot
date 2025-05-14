const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7683975860:AAGLVLjvQA7U3K3vB8DX3w4UUEXef76gimY', { polling: true });

const webAppUrl = 'https://freedom-test.vercel.app'; // ссылка на твой Vercel-деплой

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже, чтобы открыть тест:", {
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
