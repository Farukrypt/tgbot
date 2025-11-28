require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { Telegraf } = require('telegraf');
const userController = require('./controllers/userController');

const app = express();

// Keep raw body available for webhook verification if needed
app.use(express.json());

// Basic security headers (lightweight alternative to helmet)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// If behind a proxy (Heroku / Render), honor X-Forwarded headers
app.set('trust proxy', true);

// Allow client origin from env (set CLIENT_URL in .env) or allow all in development
const CLIENT_URL = process.env.CLIENT_URL || process.env.VITE_API_URL || '';
const corsOptions = CLIENT_URL
  ? { origin: CLIENT_URL, credentials: true }
  : undefined;
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/check', userController.checkUser);
app.post('/api/register', userController.register);
app.post('/api/unlock', userController.unlockReward);
app.post('/api/quiz', userController.saveQuizResult);

// Dev-only: list users (remove in production)
app.get('/api/dev/users', userController.listUsers);

// Telegram Bot (only if BOT_TOKEN provided)
if (process.env.BOT_TOKEN) {
  try {
    const bot = new Telegraf(process.env.BOT_TOKEN);

    // Basic command handlers - keep minimal and safe for production
    bot.start((ctx) => {
      const welcome = process.env.WELCOME_MESSAGE || 'Welcome!';
      const webAppUrl = process.env.WEB_APP_URL;
      const reply = { text: welcome };
      if (webAppUrl) {
        reply.reply_markup = {
          inline_keyboard: [
            [{ text: 'Open Dream App 🏆', web_app: { url: webAppUrl } }],
          ],
        };
      }
      ctx
        .reply(
          reply.text,
          reply.reply_markup ? { reply_markup: reply.reply_markup } : undefined,
        )
        .catch(() => {});
    });

    // If USE_WEBHOOK is set, register an Express webhook endpoint
    const useWebhook = process.env.USE_WEBHOOK === 'true';
    const webhookSecret = process.env.WEBHOOK_SECRET || '';

    if (useWebhook && process.env.WEBHOOK_DOMAIN) {
      // Register webhook with Telegram API (best-effort)
      const webhookUrl = `${process.env.WEBHOOK_DOMAIN.replace(
        /\/$/,
        '',
      )}/webhook`;
      bot.telegram
        .setWebhook(
          webhookUrl,
          webhookSecret ? { secret_token: webhookSecret } : undefined,
        )
        .then(() => console.log('Telegram webhook set to', webhookUrl))
        .catch((err) =>
          console.warn(
            'Failed to set Telegram webhook:',
            err && err.description ? err.description : err,
          ),
        );

      // Verify secret middleware for incoming Telegram webhook requests
      const verifyTelegramSecret = (req, res, next) => {
        if (!webhookSecret) return next();
        const header = req.get('x-telegram-bot-api-secret-token');
        if (!header || header !== webhookSecret)
          return res.status(401).send('Invalid secret');
        next();
      };

      // Use JSON body parser specifically for the webhook route
      app.post(
        '/webhook',
        verifyTelegramSecret,
        express.json(),
        async (req, res) => {
          try {
            await bot.handleUpdate(req.body, res);
            // Telegram expects a 200 OK quickly
            if (!res.headersSent) res.sendStatus(200);
          } catch (err) {
            console.error('Error handling Telegram update:', err);
            res.sendStatus(500);
          }
        },
      );

      console.log('Webhook route /webhook enabled');
    } else {
      // Launch bot in long-polling mode as fallback
      bot
        .launch()
        .then(() => console.log('Telegram bot launched (polling)'))
        .catch((err) => console.error('Failed to launch bot:', err));
    }
  } catch (err) {
    console.error('Failed to initialize Telegram bot', err);
  }
} else {
  console.warn('BOT_TOKEN not provided; Telegram bot disabled');
}

const PORT = Number(process.env.PORT) || 3000;
// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Optional: serve client static build when requested
if (process.env.SERVE_CLIENT === 'true') {
  const path = require('path');
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('/', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  // Force exit after timeout
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
