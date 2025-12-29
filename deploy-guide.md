# 🚀 VPS Deployment Guide

## Prerequisites on VPS:
- Node.js 18+ installed
- PM2 process manager
- Nginx (optional, for reverse proxy)

## Deployment Steps:

### 1. Upload Files to VPS
```bash
# Upload these files to your VPS:
- server.js
- googleDriveService.js
- package.json
- .env (with your Google Drive credentials)
- public/ folder
- ecosystem.config.js
```

### 2. Install Dependencies on VPS
```bash
npm install
npm install -g pm2
```

### 3. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Or start directly
npm start
```

### 4. Configure Firewall
```bash
# Allow port 5050
sudo ufw allow 5050
```

### 5. Optional: Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Access Your App:
- Direct: `http://YOUR_VPS_IP:5050`
- With domain: `http://your-domain.com`