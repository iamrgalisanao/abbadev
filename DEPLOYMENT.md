# ABBADev Hostinger VPS Deployment

This project deploys as a static React/Vite site served by Apache or Nginx, with a small Node.js proxy for the consultation form. The proxy keeps the n8n JWT on the VPS so it is never exposed in the browser.

## 1. VPS Requirements

- Ubuntu VPS
- Node.js 20 or newer
- Apache 2 or Nginx
- Git
- Domain DNS pointed to the VPS IP for `abbadev.com` and `www.abbadev.com`

## 2. Clone The Repository

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/iamrgalisanao/abbadev.git
cd abbadev
```

For future updates:

```bash
cd /var/www/abbadev
git pull origin main
```

## 3. Install And Build

```bash
npm ci
npm run lint
npm run build
```

The production site is generated in:

```bash
/var/www/abbadev/dist
```

## 4. Configure The n8n Proxy Environment

Create a private environment file on the VPS:

```bash
sudo mkdir -p /etc/abbadev
sudo nano /etc/abbadev/abbadev.env
```

Use this shape:

```env
# Website consultation/intake form
N8N_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-consultation
N8N_JWT=replace-with-your-consultation-token

# Chat-assistant consultation lead (separate pipeline + secret)
N8N_CHAT_WEBHOOK_URL=https://n8nautomation.abbadev.com/webhook/abbadev-chat-lead
N8N_CHAT_JWT=replace-with-your-chat-token

ALLOWED_ORIGIN=https://abbadev.com
PORT=8787
```

> `N8N_CHAT_WEBHOOK_URL` falls back to `N8N_WEBHOOK_URL` and `N8N_CHAT_JWT` falls
> back to `N8N_JWT` if omitted — so set both chat vars explicitly, otherwise chat
> leads silently reuse the consultation webhook and token.

Lock down the file:

```bash
sudo chown root:www-data /etc/abbadev/abbadev.env
sudo chmod 640 /etc/abbadev/abbadev.env
```

## 5. Install The Proxy Service

```bash
sudo cp deploy/abbadev-consultation.service /etc/systemd/system/abbadev-consultation.service
sudo systemctl daemon-reload
sudo systemctl enable abbadev-consultation
sudo systemctl start abbadev-consultation
sudo systemctl status abbadev-consultation
```

Check the proxy health endpoint:

```bash
curl http://127.0.0.1:8787/api/health
```

Expected response:

```json
{"ok":true,"service":"abbadev-consultation-proxy"}
```

## 6A. Configure Apache 2

Use this option if the VPS already runs Apache for other projects.

Enable the required Apache modules:

```bash
sudo a2enmod rewrite proxy proxy_http headers ssl
sudo systemctl restart apache2
```

Install the virtual host:

```bash
sudo cp deploy/abbadev.apache.conf /etc/apache2/sites-available/abbadev.conf
sudo a2ensite abbadev.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

If another Apache site already uses `abbadev.com`, disable or update that conflicting site first.

## 6B. Configure Nginx

Use this option only if Nginx is the front web server for this domain. Do not run Apache and Nginx on the same `80` and `443` listeners unless one is intentionally proxying to the other.

```bash
sudo cp deploy/abbadev.nginx.conf /etc/nginx/sites-available/abbadev
sudo ln -s /etc/nginx/sites-available/abbadev /etc/nginx/sites-enabled/abbadev
sudo nginx -t
sudo systemctl reload nginx
```

If a default Nginx site conflicts with the domain, remove the default enabled site:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Enable HTTPS

After DNS is pointed to the VPS, use the command that matches your web server.

For Apache:

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d abbadev.com -d www.abbadev.com
```

For Nginx:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d abbadev.com -d www.abbadev.com
```

## 8. Verify Production

Open:

- `https://abbadev.com`
- `https://abbadev.com/api/health`

Submit the consultation form and confirm that the n8n workflow receives the payload.

## 9. Normal Update Workflow

```bash
cd /var/www/abbadev
git pull origin main
npm ci
npm run lint
npm run build
sudo systemctl restart abbadev-consultation
sudo systemctl reload nginx
```
