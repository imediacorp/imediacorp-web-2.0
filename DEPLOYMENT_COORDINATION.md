# Deployment Coordination Checklist

This document outlines what needs to be coordinated with Alex Caffari (mtech.mt) for imediacorp.com deployment.

## Required Information from Alex Caffari

### 1. Server Access
- [ ] SSH hostname or IP address
- [ ] SSH username
- [ ] SSH authentication method (key-based or password)
- [ ] SSH key (if key-based) or password setup instructions

### 2. Server Configuration
- [ ] Node.js version installed (need 18+)
- [ ] Process manager used (PM2, systemd, Docker, etc.)
- [ ] Deployment directory path (e.g., `/var/www/imediacorp`)
- [ ] Port configuration (default: 3000 for Next.js)
- [ ] Reverse proxy setup (Nginx, Apache, etc.)

### 3. Domain & SSL
- [ ] DNS configuration status
- [ ] SSL certificate setup (Let's Encrypt, commercial, etc.)
- [ ] SSL certificate renewal process
- [ ] Domain redirects (www to non-www or vice versa)

### 4. Environment Variables
- [ ] Production API URL (if using FastAPI backend)
- [ ] Any other environment-specific variables
- [ ] Where to store environment variables on server

### 5. Deployment Process
- [ ] Preferred deployment method (GitHub Actions, manual script, other)
- [ ] Deployment user permissions
- [ ] Backup strategy
- [ ] Rollback procedure

## GitHub Secrets to Configure

Once we have the information above, configure these GitHub Secrets:

1. `DEPLOY_HOST` - Server hostname/IP
2. `DEPLOY_USER` - SSH username
3. `DEPLOY_PATH` - Deployment directory path
4. `DEPLOY_SSH_KEY` - Private SSH key for deployment
5. `NEXT_PUBLIC_SITE_URL` - `https://imediacorp.com`
6. `NEXT_PUBLIC_API_URL` - Backend API URL (if applicable)

## Deployment Script Configuration

For manual deployment, create `.env.production` in `web/` directory:

```bash
DEPLOY_HOST=your-server.mtech.mt
DEPLOY_USER=your-username
DEPLOY_PATH=/var/www/imediacorp
DEPLOY_SSH_KEY="-----BEGIN OPENSSH PRIVATE KEY-----\n..."
NEXT_PUBLIC_SITE_URL=https://imediacorp.com
NEXT_PUBLIC_API_URL=https://api.imediacorp.com
```

## Next Steps

1. **Contact Alex Caffari** with this checklist
2. **Gather required information**
3. **Set up GitHub Secrets** (if using automated deployment)
4. **Test deployment** to staging/test environment first
5. **Deploy to production** once verified

## Questions for Alex

1. What is the preferred deployment method?
2. Do you have a staging/test environment?
3. What is the backup and rollback procedure?
4. How should we handle environment variables?
5. What monitoring/logging is in place?
6. What is the expected uptime/SLA?

## Notes

- All deployment files are ready in the repository
- GitHub Actions workflow is configured (`.github/workflows/deploy-imediacorp.yml`)
- Manual deployment script is ready (`web/scripts/deploy.sh`)
- Site is built with Next.js 14 and ready for production

