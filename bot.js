const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const botToken = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL || 'https://freedom-test.vercel.app';
const webhookBaseUrl = process.env.WEBHOOK_URL;
const webhookSecret = process.env.WEBHOOK_SECRET || '';
const usePolling = process.env.USE_POLLING === 'true';
const webhookPath = '/telegram/webhook';
const webhookUrl = webhookBaseUrl ? `${webhookBaseUrl}${webhookPath}` : null;

if (!botToken) {
  console.error('BOT_TOKEN is required. Set BOT_TOKEN in environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(botToken, { polling: usePolling });

bot.onText(/\/start/, (msg) => {
  console.log("📩 /start от", msg.chat.username);

  bot.sendMessage(msg.chat.id, "Нажми кнопку ниже, чтобы зарегистрировать чек:", {
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

app.use(express.json());
app.post(webhookPath, (req, res) => {
  if (webhookSecret) {
    const incomingSecret = req.get('x-telegram-bot-api-secret-token');
    if (incomingSecret !== webhookSecret) {
      return res.sendStatus(401);
    }
  }

  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🌐 WebService для Render запущен на порту ${PORT}`);

  if (usePolling) {
    console.log('🤖 Bot is running in polling mode');
    return;
  }

  if (!webhookUrl) {
    console.error('WEBHOOK_URL is required when USE_POLLING is not true.');
    process.exit(1);
  }

  try {
    await bot.setWebHook(webhookUrl, webhookSecret ? { secret_token: webhookSecret } : {});
    console.log(`🔗 Webhook set: ${webhookUrl}`);
  } catch (error) {
    console.error('Failed to set webhook:', error.message);
    process.exit(1);
  }
});
