import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Proxy /api/* to the local Node consultation proxy so the consultation, chat,
// and event-registration forms work end-to-end in `npm run dev` / `npm run
// preview`. Start the proxy alongside the site with `npm run dev:proxy`.
// In production, Apache/Nginx handle this (see deploy/abbadev.{apache,nginx}.conf).
//
// /events-api/* is a read-only pass-through to the live events API, which only
// allows the abbadev.com origin (CORS). Set VITE_EVENTS_API=/events-api in a
// local .env.local to see real sessions while developing. Anything but GET is
// refused so local testing can never create a real registration.
const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8787',
    changeOrigin: true,
  },
  '/events-api': {
    target: 'https://api.abbadev.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/events-api/, ''),
    bypass: (req) => (req.method === 'GET' || req.method === 'HEAD' ? undefined : false),
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
