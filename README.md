# ABBADev Website

Personal brand and business website for Rommel Galisanao / ABBADev IT Solutions.

The site is built with React and Vite, styled with plain CSS on shared design tokens (`tokens.css`), and uses Lenis for smooth scrolling on the homepage. A small Node.js proxy forwards the consultation, chat, event, and assistant requests to n8n while keeping the webhook tokens on the server.

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

The n8n lead-handling workflow is documented in [automation/n8n/consultation-lead-workflow.md](automation/n8n/consultation-lead-workflow.md).

A full project knowledge base (business content, architecture, pages, automation, deployment, assets, and known issues) is in [docs/knowledge-base/](docs/knowledge-base/README.md).
