# 📸 Google Drive Image Upload Server

A modern Node.js server that allows users to upload images directly to Google Drive with automatic user folder organization. No local storage required - everything goes straight to Google Drive!

## ✨ Features

- 🚀 **Direct Google Drive Upload** - No local storage, images go straight to Google Drive
- 📁 **User-Specific Folders** - Automatic folder creation per user (User_1, User_2, etc.)
- 🖼️ **Image Gallery** - View all uploaded images from Google Drive
- 🔒 **CORS-Free Image Display** - Built-in image proxy to avoid CORS issues
- 🎨 **Modern UI** - Clean, responsive web interface
- ✅ **File Validation** - Only image files allowed (JPG, PNG, GIF, WebP)
- 📊 **File Information** - Shows upload time, file size, and Google Drive links

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Danish-Razzaq/drive-image-uploader.git
cd google-drive-image-upload
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Google Drive Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Drive API**

#### Step 2: Create OAuth2 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URI: `https://developers.google.com/oauthplayground`
5. Save your **Client ID** and **Client Secret**

#### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Fill in required information
3. Add your email as a test user
4. Publish the app (or keep in testing mode)

#### Step 4: Generate Refresh Token
1. Visit [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click the gear icon ⚙️ and check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In the left panel, select "Drive API v3" → `https://www.googleapis.com/auth/drive`
5. Click "Authorize APIs" and sign in with your Google account
6. Click "Exchange authorization code for tokens"
7. Copy the **refresh_token** (not the access_token)

### 4. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your credentials:
   ```env
   GOOGLE_DRIVE_CLIENT_ID=your_client_id_here
   GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_DRIVE_REDIRECT_URI=https://developers.google.com/oauthplayground
   GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token_here
   GOOGLE_DRIVE_FOLDER_NAME=UploadedImages
   ```

### 5. Run the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on **http://localhost:5050**

## 🎯 Usage

1. **Open** http://localhost:5050 in your browser
2. **Enter a User ID** (e.g., "1", "john", "user123")
3. **Select an image** file from your computer
4. **Click "Upload Image"** - it goes directly to Google Drive!
5. **View your images** - they'll appear in the gallery below

## 📁 Google Drive Structure

Your images will be organized like this:
```
Google Drive/
└── UploadedImages/           # Main folder
    ├── User_1/               # User-specific folders
    │   ├── 1234567890-photo1.jpg
    │   └── 1234567891-photo2.png
    ├── User_john/
    │   └── 1234567892-avatar.jpg
    └── User_anonymous/
        └── 1234567893-image.png
```

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serve the web interface |
| `POST` | `/upload` | Upload image to Google Drive |
| `GET` | `/user/:userId/images` | Get user's images from Google Drive |
| `GET` | `/image/:fileId` | Proxy to serve images (fixes CORS) |
| `GET` | `/health` | Server health check |

## 📂 Project Structure

```
google-drive-image-upload/
├── 📄 server.js              # Main Express server
├── 📄 googleDriveService.js   # Google Drive API wrapper
├── 📄 package.json           # Dependencies and scripts
├── 📄 .env                   # Environment variables (not in git)
├── 📄 .env.example           # Environment template
├── 📄 .gitignore             # Git ignore rules
├── 📄 README.md              # This file
└── 📁 public/
    └── 📄 index.html         # Web interface
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_DRIVE_CLIENT_ID` | OAuth2 Client ID | Required |
| `GOOGLE_DRIVE_CLIENT_SECRET` | OAuth2 Client Secret | Required |
| `GOOGLE_DRIVE_REDIRECT_URI` | OAuth2 Redirect URI | Required |
| `GOOGLE_DRIVE_REFRESH_TOKEN` | OAuth2 Refresh Token | Required |
| `GOOGLE_DRIVE_FOLDER_NAME` | Main folder name in Google Drive | `UploadedImages` |

## 🚨 Troubleshooting

### Common Issues

**1. "unauthorized_client" Error**
- Make sure your refresh token is valid and matches your client credentials
- Regenerate the refresh token using OAuth Playground

**2. "Access blocked" Error**
- Add your email as a test user in OAuth consent screen
- Or publish your app for public use

**3. Images Not Loading**
- The app uses a built-in proxy to avoid CORS issues
- Make sure the server is running and accessible

**4. "Google Drive not initialized"**
- Check your `.env` file has all required variables
- Verify your credentials are correct

### Testing Your Setup

Test your Google Drive connection:
```bash
# Check if server can connect to Google Drive
curl http://localhost:5050/health
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Drive API for cloud storage
- Express.js for the web server
- Multer for file upload handling

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Make sure your Google Drive setup is correct

---

**Made with ❤️ for easy image uploads to Google Drive**