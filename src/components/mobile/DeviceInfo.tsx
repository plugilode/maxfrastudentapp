import React, { useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import { Smartphone, Info } from 'lucide-react';

interface DeviceInfoData {
  platform: string;
  model: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  webViewVersion: string;
}

const DeviceInfo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const info = await Device.getInfo();
          setDeviceInfo(info);
        } catch (error) {
          console.error('Error getting device info:', error);
        }
      }
    };

    loadDeviceInfo();
  }, []);

  if (!Capacitor.isNativePlatform() || !deviceInfo) return null;

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  return (
    <>
      <button
        onClick={handleToggleInfo}
        className="fixed bottom-20 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
        aria-label="Información del dispositivo"
      >
        <Info className="w-5 h-5" />
      </button>

      {showInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-lg font-bold text-white">Información del Dispositivo</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Plataforma:</span>
                <span className="text-white">{deviceInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Modelo:</span>
                <span className="text-white">{deviceInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Sistema:</span>
                <span className="text-white">{deviceInfo.operatingSystem} {deviceInfo.osVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Fabricante:</span>
                <span className="text-white">{deviceInfo.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">WebView:</span>
                <span className="text-white">{deviceInfo.webViewVersion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Emulador:</span>
                <span className="text-white">{deviceInfo.isVirtual ? 'Sí' : 'No'}</span>
              </div>
            </div>

            <button
              onClick={handleCloseInfo}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceInfo;