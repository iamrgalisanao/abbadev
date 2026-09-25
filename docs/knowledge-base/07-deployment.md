# Deployment

The authoritative guide is `DEPLOYMENT.md`. This page summarises it and adds the parts it leaves out.

## Target

- **Server:** a Hostinger Ubuntu VPS with Node 20+ and either Apache 2 or Nginx.
- **DNS:** `abbadev.com` and `www.abbadev.com` point at the VPS.
- **Code:** a clone of `github.com/iamrgalisanao/abbadev` at `/var/www/abbadev`. The site is served from `/var/www/abbadev/dist`.
- **Secrets:** `/etc/abbadev/abbadev.env`, owned `root:www-data`, mode `640`.
- **Other services:** n8n runs separately at `n8nautomation.abbadev.com`, and the events API at `api.abbadev.com`.

## Pieces

| File | Purpose |
|---|---|
| `deploy/abbadev-consultation.service` | systemd unit that runs `/usr/bin/node server/consultation-proxy.mjs` as `www-data` from `/var/www/abbadev`, with `EnvironmentFile=/etc/abbadev/abbadev.env` and `Restart=always` (5 s delay) |
| `deploy/abbadev.nginx.conf` | Port 80, root `dist`, SPA fallback `try_files $uri $uri/ /index.html`, `/api/` proxied to `127.0.0.1:8787`, static assets cached for 30 days as immutable |
| `deploy/abbadev.apache.conf` | `*:80` vhost, DocumentRoot `dist`, SPA fallback via mod_rewrite, `ProxyPass /api/` to `:8787`. Needs the `rewrite`, `proxy`, `proxy_http`, `headers` and `ssl` modules |
| `deploy/abbadev.env.example` | Minimal server env template. It's older and shorter than `.env.example` |

HTTPS is set up with `certbot --nginx` or `certbot --apache`.

## First deploy (outline)

1. Install Node 20+ and a web server.
2. Clone the repo to `/var/www/abbadev`.
3. Create `/etc/abbadev/abbadev.env` with the server variables listed in [05](05-forms-assistant-proxy.md#environment-variables).
4. **Set the `VITE_*` variables in the build environment.** Vite bakes them into the bundle at build time. `DEPLOYMENT.md` doesn't mention this.
5. Run `npm ci && npm run lint && npm run build`.
6. Install the systemd unit, then run `systemctl enable --now abbadev-consultation`.
7. Install the vhost config and reload the web server.
8. Run certbot.
9. Check that `curl https://abbadev.com/api/health` returns `{"ok":true,...}`.

## Updating

```bash
cd /var/www/abbadev
git pull
npm ci
npm run lint && npm run build
sudo systemctl restart abbadev-consultation
sudo systemctl reload nginx   # or apache2
```

## Notes

- `DEPLOYMENT.md` and `deploy/abbadev.env.example` were updated on 2026-09-25 to cover the assistant variables and the build-time `VITE_*` variables.
- The proxy doesn't specify a host, so it listens on every network interface. Make sure the firewall blocks public access to port 8787.
