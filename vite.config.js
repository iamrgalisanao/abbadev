import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Proxy /api/* to the local Node consultation proxy so the consultation, chat,
// and event-registration forms work end-to-end in `npm run dev` / `npm run
// preview`. Start the proxy alongside the site with `npm run dev:proxy`.
// In production, Apache/Nginx handle this (see deploy/abbadev.{apache,nginx}.conf).
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8787',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
