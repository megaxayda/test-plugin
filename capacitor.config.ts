import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tai.testplugin',
  appName: 'vite-reactts-eslint-prettier',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.28.145:3000/',
    cleartext: true,
  },
};

export default config;
