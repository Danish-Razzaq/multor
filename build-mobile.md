# 📱 Mobile App Setup Guide

## Prerequisites
Before you start, make sure you have:

### For Android:
- **Android Studio** installed
- **Java Development Kit (JDK) 11 or higher**
- **Android SDK** (comes with Android Studio)

### For iOS (Mac only):
- **Xcode** installed
- **iOS Simulator** or physical iOS device

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Capacitor (First time only)
```bash
npx cap init "Drive Uploader" "com.driveuploader.app" --web-dir=public
```

### 3. Add Mobile Platforms

#### For Android:
```bash
npx cap add android
```

#### For iOS (Mac only):
```bash
npx cap add ios
```

### 4. Sync Your Web Code
```bash
npx cap sync
```

### 5. Open in Native IDE

#### For Android:
```bash
npx cap open android
```
This opens Android Studio where you can:
- Build the APK
- Run on emulator
- Deploy to connected device

#### For iOS:
```bash
npx cap open ios
```
This opens Xcode where you can:
- Build the app
- Run on iOS Simulator
- Deploy to connected iPhone/iPad

## Testing Options

### 1. Web Browser (Quick Test)
```bash
npm start
```
Then open: http://localhost:5050

### 2. Android Emulator
1. Open Android Studio
2. Start an Android Virtual Device (AVD)
3. Run: `npx cap run android`

### 3. Physical Android Device
1. Enable Developer Options on your phone
2. Enable USB Debugging
3. Connect via USB
4. Run: `npx cap run android`

### 4. iOS Simulator (Mac only)
```bash
npx cap run ios
```

## Building for Production

### Android APK:
1. Open Android Studio
2. Go to Build → Generate Signed Bundle/APK
3. Choose APK
4. Create/use signing key
5. Build release APK

### iOS App:
1. Open Xcode
2. Select your device/simulator
3. Product → Archive
4. Distribute to App Store or for testing

## Important Notes

### Server Configuration:
Your backend server needs to be accessible from mobile devices. Options:

1. **Local Network**: Use your computer's IP address
2. **Cloud Deployment**: Deploy to Heroku, Vercel, etc.
3. **Ngrok**: For testing with external access

### Update Server URL:
In your mobile app, update the fetch URLs from:
```javascript
fetch('/upload', ...)
```
To:
```javascript
fetch('http://YOUR_SERVER_IP:5050/upload', ...)
```

## Quick Start Commands

```bash
# Install everything
npm install

# Add Android platform
npx cap add android

# Sync and open Android Studio
npx cap sync && npx cap open android

# For iOS (Mac only)
npx cap add ios
npx cap sync && npx cap open ios
```

## Troubleshooting

### Common Issues:
1. **Gradle Build Failed**: Update Android Studio and SDK
2. **iOS Build Failed**: Check Xcode version compatibility
3. **Network Issues**: Make sure server is accessible from mobile device
4. **CORS Errors**: Server already has CORS enabled

### Server Access from Mobile:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Start server: `npm start`
3. Access from mobile: `http://YOUR_IP:5050`