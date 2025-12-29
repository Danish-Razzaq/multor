const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const GoogleDriveService = require('./googleDriveService');
require('dotenv').config();

const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Also increase for form data
app.use(express.static('public'));

// Google Drive setup
let googleDriveService;

async function initializeGoogleDrive() {
  try {
    const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
    const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
    const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (driveClientId && driveClientSecret && driveRedirectUri && driveRefreshToken) {
      googleDriveService = new GoogleDriveService(
        driveClientId,
        driveClientSecret,
        driveRedirectUri,
        driveRefreshToken
      );
      console.log('✅ Google Drive initialized with OAuth2');
    } else {
      console.log('⚠️  Google Drive credentials not found in .env file');
    }
  } catch (error) {
    console.error('❌ Google Drive initialization failed:', error.message);
  }
}

// Initialize Google Drive on startup
initializeGoogleDrive();

// Multer configuration for memory storage (no local files)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Function to upload file to Google Drive with user folders
async function uploadToGoogleDrive(fileBuffer, fileName, fileMimeType, userId) {
  if (!googleDriveService) {
    throw new Error('Google Drive not initialized. Please check your .env credentials.');
  }

  try {
    const mainFolderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'UploadedImages';
    const userFolderName = `User_${userId}`;
    
    // Search for or create main folder
    let mainFolder = await googleDriveService.searchFolder(mainFolderName).catch(() => null);
    if (!mainFolder) {
      console.log(`📁 Creating main folder: ${mainFolderName}`);
      mainFolder = await googleDriveService.createFolder(mainFolderName);
    }

    // Search for or create user folder inside main folder
    let userFolder = await googleDriveService.searchFolder(userFolderName, mainFolder.id).catch(() => null);
    if (!userFolder) {
      console.log(`📁 Creating user folder: ${userFolderName}`);
      userFolder = await googleDriveService.createFolder(userFolderName, mainFolder.id);
    }

    // Upload file to user folder
    const timestamp = Date.now();
    const finalFileName = `${timestamp}-${fileName}`;
    
    const driveFile = await googleDriveService.saveFileFromBuffer(
      finalFileName,
      fileBuffer,
      fileMimeType,
      userFolder.id
    );

    // Make file publicly accessible
    await googleDriveService.makeFilePublic(driveFile.id);

    return {
      ...driveFile,
      publicUrl: `/image/${driveFile.id}`, // Use our proxy endpoint
      driveDirectUrl: `https://drive.google.com/uc?id=${driveFile.id}`,
      userFolder: userFolder
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

// Helper function to get MIME type from file buffer
function getMimeTypeFromBuffer(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    googleDrive: googleDriveService ? 'Connected' : 'Not configured',
    timestamp: new Date().toISOString()
  });
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file && !req.body.imageData) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.body.userId || 'anonymous';
    let fileName, fileBuffer, mimeType;

    if (req.body.imageData) {
      // Handle base64 data from mobile app
      console.log('📱 Processing base64 upload from mobile app');
      fileName = req.body.fileName || 'mobile-upload.jpg';
      mimeType = req.body.mimeType || 'image/jpeg';
      fileBuffer = Buffer.from(req.body.imageData, 'base64');
    } else {
      // Handle regular file upload from web
      console.log('🌐 Processing file upload from web');
      fileName = req.file.originalname;
      fileBuffer = req.file.buffer;
      mimeType = getMimeTypeFromBuffer(fileName);
    }

    let driveFile = null;
    
    // Upload directly to Google Drive (no local storage)
    try {
      if (googleDriveService) {
        driveFile = await uploadToGoogleDrive(fileBuffer, fileName, mimeType, userId);
        console.log('✅ File uploaded to Google Drive:', driveFile.name);
      }
    } catch (driveError) {
      console.error('❌ Google Drive upload failed:', driveError.message);
      return res.status(500).json({ error: 'Google Drive upload failed: ' + driveError.message });
    }

    const response = {
      success: true,
      message: 'File uploaded successfully to Google Drive',
      driveFile: {
        id: driveFile.id,
        name: driveFile.name,
        publicUrl: driveFile.publicUrl,
        webViewLink: driveFile.webViewLink,
        userFolder: driveFile.userFolder.name
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

app.get('/user/:userId/images', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!googleDriveService) {
      return res.status(500).json({ error: 'Google Drive not configured' });
    }

    const mainFolderName = process.env.GOOGLE_DRIVE_FOLDER_NAME || 'UploadedImages';
    const userFolderName = `User_${userId}`;
    
    // Find main folder
    const mainFolder = await googleDriveService.searchFolder(mainFolderName).catch(() => null);
    if (!mainFolder) {
      return res.json({ images: [] });
    }

    // Find user folder
    const userFolder = await googleDriveService.searchFolder(userFolderName, mainFolder.id).catch(() => null);
    if (!userFolder) {
      return res.json({ images: [] });
    }

    // Get files in user folder
    const files = await googleDriveService.getFilesInFolder(userFolder.id);
    
    const images = files.map(file => ({
      id: file.id,
      name: file.name,
      publicUrl: `/image/${file.id}`, // Use our proxy endpoint
      driveDirectUrl: `https://drive.google.com/uc?id=${file.id}`,
      webViewLink: file.webViewLink,
      uploadTime: file.createdTime,
      size: file.size
    }));

    res.json({ images });

  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ error: 'Failed to fetch images: ' + error.message });
  }
});

// Proxy endpoint to serve images from Google Drive (fixes CORS issues)
app.get('/image/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    
    if (!googleDriveService) {
      return res.status(500).json({ error: 'Google Drive not configured' });
    }

    // Get file stream from Google Drive
    const response = await googleDriveService.driveClient.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' });

    // Set appropriate headers
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'Access-Control-Allow-Origin': '*'
    });

    // Pipe the image stream to response
    response.data.pipe(res);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(404).json({ error: 'Image not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Backend API on port ${PORT}`);
  console.log(`📁 Images stored directly in Google Drive`);
});