import React, { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setupNetworkMonitoring = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Get initial network status
          const status = await Network.getStatus();
          setIsOnline(status.connected);
          setShowIndicator(!status.connected);

          // Listen for network changes
          const listener = await Network.addListener('networkStatusChange', (status) => {
            setIsOnline(status.connected);
            setShowIndicator(!status.connected);
            
            // Hide indicator after 3 seconds if back online
            if (status.connected) {
              setTimeout(() => setShowIndicator(false), 3000);
            }
          });

          cleanup = () => listener.remove();
        } catch (error) {
          console.error('Error setting up network monitoring:', error);
        }
      } else {
        // Web fallback
        const updateOnlineStatus = () => {
          const online = navigator.onLine;
          setIsOnline(online);
          setShowIndicator(!online);
          
          if (online) {
            setTimeout(() => setShowIndicator(false), 3000);
          }
        };

        // Initial check
        updateOnlineStatus();

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        cleanup = () => {
          window.removeEventListener('online', updateOnlineStatus);
          window.removeEventListener('offline', updateOnlineStatus);
        };
      }
    };

    setupNetworkMonitoring();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-16 left-4 right-4 z-40 transition-all duration-300 ${
      showIndicator ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className={`flex items-center justify-center p-3 rounded-lg backdrop-blur-sm ${
        isOnline 
          ? 'bg-green-500/20 border border-green-500/50' 
          : 'bg-red-500/20 border border-red-500/50'
      }`}>
        {isOnline ? (
          <Wifi className="w-5 h-5 text-green-400 mr-2" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-400 mr-2" />
        )}
        <span className={`text-sm font-medium ${
          isOnline ? 'text-green-200' : 'text-red-200'
        }`}>
          {isOnline ? 'Conexión restablecida' : 'Sin conexión a internet'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;