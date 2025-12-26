#!/bin/bash
# Manual deployment script for imediacorp.com
# Usage: ./scripts/deploy.sh [environment]
# Environment: staging|production (default: production)

set -e

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load environment variables
if [ -f "$WEB_DIR/.env.$ENVIRONMENT" ]; then
  source "$WEB_DIR/.env.$ENVIRONMENT"
fi

# Default values (override with .env file or environment variables)
DEPLOY_HOST=${DEPLOY_HOST:-""}
DEPLOY_USER=${DEPLOY_USER:-""}
DEPLOY_PATH=${DEPLOY_PATH:-"/var/www/imediacorp"}
DEPLOY_KEY=${DEPLOY_SSH_KEY:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}CHADD Suite - ImediaCorp Deployment Script${NC}"
echo "Environment: $ENVIRONMENT"
echo ""

# Validate required variables
if [ -z "$DEPLOY_HOST" ] || [ -z "$DEPLOY_USER" ]; then
  echo -e "${RED}Error: DEPLOY_HOST and DEPLOY_USER must be set${NC}"
  echo "Set them in .env.$ENVIRONMENT or as environment variables"
  exit 1
fi

# Check if we're in the web directory
if [ ! -f "$WEB_DIR/package.json" ]; then
  echo -e "${RED}Error: Must run from web directory or parent${NC}"
  exit 1
fi

cd "$WEB_DIR"

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm ci

echo -e "${YELLOW}Step 2: Building Next.js application...${NC}"
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-"https://imediacorp.com"} \
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-"http://localhost:8000"} \
npm run build

echo -e "${YELLOW}Step 3: Creating deployment package...${NC}"
tar -czf /tmp/imediacorp-deploy.tar.gz \
  .next \
  public \
  src \
  package.json \
  package-lock.json \
  next.config.js \
  postcss.config.js \
  tailwind.config.js \
  tsconfig.json \
  .env.production 2>/dev/null || true

echo -e "${YELLOW}Step 4: Deploying to $DEPLOY_HOST...${NC}"

# Setup SSH
SSH_KEY_FILE="$HOME/.ssh/imediacorp_deploy_key"
if [ -n "$DEPLOY_KEY" ]; then
  mkdir -p "$HOME/.ssh"
  echo "$DEPLOY_KEY" > "$SSH_KEY_FILE"
  chmod 600 "$SSH_KEY_FILE"
  SSH_OPTS="-i $SSH_KEY_FILE"
else
  SSH_OPTS=""
fi

# Deploy
scp $SSH_OPTS /tmp/imediacorp-deploy.tar.gz "$DEPLOY_USER@$DEPLOY_HOST:/tmp/"

ssh $SSH_OPTS "$DEPLOY_USER@$DEPLOY_HOST" << EOF
  set -e
  cd $DEPLOY_PATH
  
  # Backup current deployment
  if [ -d ".next" ]; then
    echo "Creating backup..."
    BACKUP_NAME="backup-\$(date +%Y%m%d-%H%M%S).tar.gz"
    tar -czf "\$BACKUP_NAME" .next public src package.json next.config.js postcss.config.js tailwind.config.js tsconfig.json 2>/dev/null || true
    echo "Backup created: \$BACKUP_NAME"
  fi
  
  # Extract new deployment
  echo "Extracting new deployment..."
  tar -xzf /tmp/imediacorp-deploy.tar.gz -C $DEPLOY_PATH
  
  # Install production dependencies
  echo "Installing production dependencies..."
  npm ci --production || npm install --production
  
  # Restart application
  echo "Restarting application..."
  # Uncomment and adjust based on your setup:
  # PM2: pm2 restart imediacorp || pm2 start npm --name imediacorp -- start
  # Systemd: sudo systemctl restart imediacorp
  # Docker: docker-compose restart
  
  # Cleanup
  rm /tmp/imediacorp-deploy.tar.gz
  echo "Deployment completed successfully!"
EOF

# Cleanup
rm -f /tmp/imediacorp-deploy.tar.gz
if [ -f "$SSH_KEY_FILE" ]; then
  rm -f "$SSH_KEY_FILE"
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "Site should be live at: ${NEXT_PUBLIC_SITE_URL:-https://imediacorp.com}"

