import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d42693406a04445b9b9ca83ba6ae72f8',
  appName: 'coy-clone-studio',
  webDir: 'dist',
  server: {
    url: 'https://d4269340-6a04-445b-9b9c-a83ba6ae72f8.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
