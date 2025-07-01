import React, { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Download, RefreshCw } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

const AppUpdate: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Listen for app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          // Check for updates when app becomes active
          checkForUpdates();
        }
      });

      // Initial check
      checkForUpdates();
    }
  }, []);

  const checkForUpdates = async () => {
    try {
      // In a real app, you would check your server for updates
      // For now, we'll simulate this
      const hasUpdate = Math.random() < 0.1; // 10% chance for demo
      setUpdateAvailable(hasUpdate);
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // In a real app, you would download and install the update
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUpdateAvailable(false);
      
      // Optionally restart the app
      // await App.exitApp();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-purple-400 mr-3" />
            <div>
              <p className="text-white font-medium">Actualización disponible</p>
              <p className="text-white/70 text-sm">Nueva versión con mejoras</p>
            </div>
          </div>
          <Button
            onClick={handleUpdate}
            isLoading={isUpdating}
            variant="primary"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AppUpdate;