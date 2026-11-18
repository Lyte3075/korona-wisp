# Korona Wisp Relay

A small Node.js Wisp v1/v2-compatible WebSocket relay for Korona.

## Run locally

```sh
npm install
npm start
```

The server listens on `PORT` (default: `5001`).

- HTTP health check: `/health`
- Wisp WebSocket endpoint: `wss://YOUR-HOST/`

## Railway

Deploy this repository from the `main` branch. Railway detects `package.json`, installs dependencies, and runs `npm start`.

The relay blocks private, loopback, and direct-IP destinations and applies per-connection stream limits. It is intended for the Korona client and should not be treated as an authenticated private service.
