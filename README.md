# Dream Telegram App (Demo)

This repository contains a Telegram Web App demo with a Node/Express server and a React (Vite) client.

## Quick start (development)

1. Server

```powershell
cd server
copy .env.example .env    # then edit .env with your real MONGO_URI and BOT_TOKEN
npm install
npm start
```

2. Client

```powershell
cd client
copy .env.example .env    # optionally set VITE_API_URL
npm install
npm run dev
```

Open the client dev URL printed by Vite (usually `http://localhost:5173`).

## Required environment variables

Server (`server/.env`)

- `MONGO_URI` - MongoDB connection string
- `BOT_TOKEN` - Telegram bot token from BotFather
- `WEB_APP_URL` - public URL of the client app (used in Telegram Web App button)
- `PORT` - optional server port (default 3000)

Client (`client/.env`)

- `VITE_API_URL` - Base URL of the server (e.g. `http://localhost:3000`). Vite prefixes env vars with `VITE_`.

## Notes

- The project contains placeholder pages for `Winners`, `Prizes`, `Terms`, and `Help` under `client/src/pages/`.
- The server returns generated unlock codes on registration for development convenience. Do not expose those in production.

If you'd like, I can: add a simple dev-only API to list all users, add more input validation, or wire the client to the Telegram WebApp signature verification flow.
