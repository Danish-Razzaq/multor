# 🚀 Deployment Guide

This guide covers different ways to deploy your Google Drive Image Upload Server.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Google Drive OAuth2 credentials set up
- ✅ All environment variables configured
- ✅ Tested the application locally

## 🌐 Deployment Options

### 1. Heroku (Recommended for beginners)

#### Step 1: Prepare for Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_DRIVE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
heroku config:set GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
heroku config:set GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
heroku config:set GOOGLE_DRIVE_FOLDER_NAME=UploadedImages
```

#### Step 3: Deploy
```bash
# Deploy to Heroku
git push heroku main

# Open your app
heroku open
```

### 2. Railway

#### Step 1: Connect Repository
1. Go to [Railway](https://railway.app/)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

#### Step 2: Set Environment Variables
In Railway dashboard:
- Add all your environment variables from `.env`
- Railway will automatically detect it's a Node.js app

#### Step 3: Deploy
- Railway automatically deploys on git push
- Your app will be available at the provided URL

### 3. Vercel

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Configure for Vercel
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

#### Step 3: Deploy
```bash
# Deploy to Vercel
vercel

# Set environment variables
vercel env add GOOGLE_DRIVE_CLIENT_ID
vercel env add GOOGLE_DRIVE_CLIENT_SECRET
vercel env add GOOGLE_DRIVE_REDIRECT_URI
vercel env add GOOGLE_DRIVE_REFRESH_TOKEN
vercel env add GOOGLE_DRIVE_FOLDER_NAME
```

### 4. DigitalOcean App Platform

#### Step 1: Create App
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Create new App
3. Connect your GitHub repository

#### Step 2: Configure
- Set build command: `npm install`
- Set run command: `npm start`
- Add environment variables

#### Step 3: Deploy
- DigitalOcean automatically builds and deploys

### 5. AWS EC2 (Advanced)

#### Step 1: Launch EC2 Instance
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 2: Setup Environment
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

#### Step 3: Deploy Application
```bash
# Clone your repository
git clone https://github.com/Danish-Razzaq/drive-image-uploader.git
cd google-drive-image-upload

# Install dependencies
npm install

# Create .env file with your credentials
nano .env

# Start with PM2
pm2 start server.js --name "image-upload"
pm2 startup
pm2 save
```

#### Step 4: Setup Nginx (Optional)
```bash
# Install Nginx
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/image-upload
```

Add this configuration:
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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/image-upload /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Security Considerations

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use platform-specific environment variable systems
- ✅ Rotate your Google OAuth tokens periodically

### HTTPS
- ✅ Always use HTTPS in production
- ✅ Most platforms provide free SSL certificates
- ✅ Update your Google OAuth redirect URIs to use HTTPS

### Rate Limiting
Consider adding rate limiting for production:
```bash
npm install express-rate-limit
```

## 📊 Monitoring

### Health Checks
Your app includes a health endpoint:
```
GET /health
```

### Logging
- Monitor your application logs
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Google Drive API usage

## 🔧 Environment-Specific Configuration

### Production Optimizations
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  // Enable trust proxy
  app.set('trust proxy', 1);
  
  // Add security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}
```

## 🚨 Troubleshooting Deployment

### Common Issues

**Port Issues**
```javascript
// Use environment port or default
const PORT = process.env.PORT || 5050;
```

**Google Drive API Limits**
- Monitor your API usage in Google Cloud Console
- Implement proper error handling for rate limits

**Memory Issues**
- Monitor memory usage
- Consider implementing file size limits
- Use streaming for large files

## 📞 Support

If you encounter deployment issues:
1. Check the platform-specific logs
2. Verify all environment variables are set
3. Test your Google Drive credentials
4. Check the troubleshooting section in README.md

Happy deploying! 🎉