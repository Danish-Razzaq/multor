import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.driveuploader.app',
  appName: 'Drive Uploader',
  webDir: 'public',
  server: {
    cleartext: true,
    allowNavigation: ['*'],
    url: 'http://192.168.18.5:5050'
  }
};

export default config;
