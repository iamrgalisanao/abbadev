# ABBADev Website

Personal brand and business website for Rommel Galisanao / ABBADev Tech Solutions.

The site is built with React, Vite, Tailwind CSS, Framer Motion, and a small Node.js proxy for the consultation form. The proxy forwards submissions to n8n while keeping the JWT on the server.

## Local Development

```bash
npm install
npm run dev
```

In another terminal, run the consultation proxy when testing form submissions:

```bash
npm run dev:proxy
```

## Production Build

```bash
npm run lint
npm run build
```

Deployment instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).
