import React from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import AppUpdate from './AppUpdate';
import OfflineIndicator from './OfflineIndicator';
import DeviceInfo from './DeviceInfo';

const MobileOptimizations: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Configure status bar
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#1e1b4b' });
      
      // Hide splash screen after app loads
      SplashScreen.hide();

      // Prevent zoom on input focus (iOS)
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }
  }, []);

  return (
    <>
      {children}
      <AppUpdate />
      <OfflineIndicator />
      <DeviceInfo />
    </>
  );
};

export default MobileOptimizations;