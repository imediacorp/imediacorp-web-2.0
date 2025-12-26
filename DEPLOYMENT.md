# ImediaCorp Website Deployment Guide

This guide covers deployment of the imediacorp.com website to mtech.mt hosting (managed by Alex Caffari).

## Prerequisites

1. **Access Credentials**: SSH access to mtech.mt server
2. **Server Configuration**: Node.js 18+, PM2 or similar process manager
3. **Domain Setup**: DNS configured for imediacorp.com
4. **SSL Certificate**: Let's Encrypt or other SSL certificate configured

## Deployment Methods

### Method 1: GitHub Actions (Automated)

GitHub Actions will automatically deploy when changes are pushed to the `main` branch in the `web/` directory.

#### Setup

1. **Add GitHub Secrets**:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DEPLOY_HOST`: mtech.mt server hostname or IP
     - `DEPLOY_USER`: SSH username
     - `DEPLOY_PATH`: Deployment path on server (e.g., `/var/www/imediacorp`)
     - `DEPLOY_SSH_KEY`: Private SSH key for deployment
     - `NEXT_PUBLIC_SITE_URL`: `https://imediacorp.com`
     - `NEXT_PUBLIC_API_URL`: Backend API URL (if applicable)

2. **Workflow File**: `.github/workflows/deploy-imediacorp.yml` is already configured

3. **Trigger Deployment**:
   - Push changes to `main` branch
   - Or manually trigger via GitHub Actions UI

### Method 2: Manual Deployment Script

Use the manual deployment script for direct control.

#### Setup

1. **Create Environment File**:
   ```bash
   cd web
   cp .env.example .env.production
   ```

2. **Configure Environment Variables**:
   ```bash
   # .env.production
   DEPLOY_HOST=your-server.mtech.mt
   DEPLOY_USER=your-username
   DEPLOY_PATH=/var/www/imediacorp
   DEPLOY_SSH_KEY="-----BEGIN OPENSSH PRIVATE KEY-----\n..."
   NEXT_PUBLIC_SITE_URL=https://imediacorp.com
   NEXT_PUBLIC_API_URL=https://api.imediacorp.com
   ```

3. **Run Deployment**:
   ```bash
   cd web
   ./scripts/deploy.sh production
   ```

## Server Configuration

### Node.js Setup

Ensure Node.js 18+ is installed:
```bash
node --version  # Should be 18.x or higher
```

### Process Manager (PM2)

Recommended process manager for Node.js applications:

```bash
# Install PM2
npm install -g pm2

# Start application
cd /var/www/imediacorp
pm2 start npm --name imediacorp -- start

# Save PM2 configuration
pm2 save
pm2 startup  # Follow instructions to enable on boot
```

### Nginx Configuration (if using reverse proxy)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name imediacorp.com www.imediacorp.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name imediacorp.com www.imediacorp.com;
    
    ssl_certificate /etc/letsencrypt/live/imediacorp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/imediacorp.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d imediacorp.com -d www.imediacorp.com

# Auto-renewal (should be automatic)
sudo certbot renew --dry-run
```

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SITE_URL`: Full site URL (e.g., `https://imediacorp.com`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (if using FastAPI backend)

### Optional Variables

- `NODE_ENV`: `production` (set automatically in production)
- `ANALYTICS_ID`: Google Analytics or other analytics ID

## Post-Deployment Checklist

- [ ] Verify site is accessible at https://imediacorp.com
- [ ] Check SSL certificate is valid
- [ ] Test all pages load correctly
- [ ] Verify sitemap.xml is accessible
- [ ] Check robots.txt is accessible
- [ ] Test contact form (if implemented)
- [ ] Verify SEO meta tags are present
- [ ] Check mobile responsiveness
- [ ] Test page load speed (Core Web Vitals)
- [ ] Set up monitoring/logging

## Troubleshooting

### Build Errors

If build fails, check:
- Node.js version (must be 18+)
- Dependencies installed correctly (`npm ci`)
- Environment variables set correctly

### Deployment Errors

If deployment fails:
- Verify SSH access works: `ssh user@host`
- Check deployment path exists and is writable
- Verify process manager is configured correctly
- Check server logs: `pm2 logs imediacorp` or system logs

### Site Not Loading

If site doesn't load:
- Check if application is running: `pm2 status`
- Verify port 3000 is accessible (or configured port)
- Check Nginx/reverse proxy configuration
- Verify DNS is pointing to correct server
- Check firewall rules

## Coordination with Alex Caffari (mtech.mt)

### Information Needed

1. **Server Access**:
   - SSH hostname/IP
   - SSH username
   - SSH key or password authentication method

2. **Server Configuration**:
   - Node.js version
   - Process manager (PM2, systemd, Docker, etc.)
   - Deployment path
   - Port configuration

3. **Domain & SSL**:
   - DNS configuration status
   - SSL certificate setup
   - Reverse proxy configuration (if any)

4. **Environment**:
   - Production environment variables
   - API endpoints (if applicable)
   - Database connections (if applicable)

### Contact

For deployment coordination, contact Alex Caffari at mtech.mt.

## Support

For issues or questions:
- Check logs first
- Review this deployment guide
- Contact Alex Caffari for server-related issues
- Contact development team for application issues

