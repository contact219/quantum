#!/bin/bash
set -e
cd /var/www/quantumsurety
echo '[deploy] Pulling latest...'
git pull origin main
echo '[deploy] Installing dependencies...'
npm install --silent
echo '[deploy] Building...'
npm run build
echo '[deploy] Restarting PM2...'
pm2 restart quantumsurety --update-env
echo '[deploy] Done.'
