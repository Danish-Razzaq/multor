# 📱 Build Installable APK Guide

## Method 1: Android Studio (Recommended)

### 1. Update Config for Production
1. Edit `public/config.js`
2. Replace `http://192.168.18.5:5050` with your VPS URL:
   ```javascript
   return 'http://YOUR_VPS_IP:5050';
   // or
   return 'https://your-domain.com';
   ```

### 2. Sync Changes
```bash
npx cap sync
```

### 3. Open Android Studio
```bash
npx cap open android
```

### 4. Build APK in Android Studio
1. **Build → Generate Signed Bundle/APK**
2. Choose **APK**
3. Click **Next**
4. **Create New Keystore** (first time):
   - Choose location: `C:\Users\user\keystore\drive-uploader.jks`
   - Password: `your-secure-password`
   - Alias: `drive-uploader`
   - Fill in certificate info
5. **Build Type:** Release
6. **Signature Versions:** V1 and V2
7. Click **Finish**

### 5. Find Your APK
- Location: `android/app/build/outputs/apk/release/app-release.apk`
- This is your installable APK file!

## Method 2: Command Line Build

### 1. Build Release APK
```bash
cd android
./gradlew assembleRelease
```

### 2. Find APK
- Location: `android/app/build/outputs/apk/release/app-release.apk`

## Install APK on Phone

### Option A: Direct Install
1. Copy `app-release.apk` to your phone
2. Enable "Install from Unknown Sources"
3. Tap the APK file to install

### Option B: ADB Install
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

## Distribution Options

### 1. Direct Distribution
- Share the APK file directly
- Users install manually

### 2. Google Play Store
- Create Google Play Console account
- Upload signed APK/AAB
- Follow Play Store guidelines

### 3. Alternative App Stores
- Amazon Appstore
- Samsung Galaxy Store
- F-Droid (for open source)

## Important Notes

### Security:
- Keep your keystore file safe!
- Use strong passwords
- Back up your keystore

### Updates:
- Use same keystore for updates
- Increment version code in `build.gradle`

### Testing:
- Test APK on different devices
- Verify server connection works