# 🐳 Docker Deployment Guide

## Prerequisites on VPS:
- Docker installed
- Docker Compose installed

## Quick Deploy Commands

### 1. Upload Files to VPS
Upload these files to your VPS:
```
- Dockerfile
- docker-compose.yml
- package.json
- server.js
- googleDriveService.js
- public/ folder
- .env (with your Google Drive credentials)
```

### 2. Build and Run with Docker Compose
```bash
# Build and start the container
docker-compose up -d --build

# Check if running
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Alternative: Manual Docker Commands
```bash
# Build image
docker build -t drive-uploader .

# Run container
docker run -d \
  --name drive-uploader-app \
  -p 5050:5050 \
  --env-file .env \
  drive-uploader
```

## Management Commands

### View Logs
```bash
docker-compose logs -f drive-uploader
```

### Restart Application
```bash
docker-compose restart
```

### Stop Application
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest code, then:
docker-compose down
docker-compose up -d --build
```

### Access Container Shell
```bash
docker-compose exec drive-uploader sh
```

## Access Your App
- **Direct:** `http://YOUR_VPS_IP:5050`
- **With domain:** Setup nginx reverse proxy

## Nginx Reverse Proxy (Optional)

### nginx.conf
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
        client_max_body_size 50M;
    }
}
```

## Troubleshooting

### Check Container Status
```bash
docker ps
docker-compose ps
```

### View Container Logs
```bash
docker logs drive-uploader-app
docker-compose logs drive-uploader
```

### Check Port Binding
```bash
netstat -tlnp | grep 5050
```

### Firewall (if needed)
```bash
sudo ufw allow 5050
```

## Environment Variables
Make sure your `.env` file contains:
```
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
GOOGLE_DRIVE_REDIRECT_URI=your_redirect_uri
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_NAME=UploadedImages
```