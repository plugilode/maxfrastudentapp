import { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const useMobileCamera = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      setError('Función disponible solo en dispositivos móviles');
      return null;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1280,
        height: 720
      });

      return image.dataUrl || null;
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string })?.message || 'Error desconocido';
      setError(`Error al capturar la imagen: ${errorMessage}`);
      console.error('Mobile camera error:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const checkPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return false;
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      setError('No se pudieron obtener los permisos de cámara');
      return false;
    }
  }, []);

  return {
    capturePhoto,
    checkPermissions,
    requestPermissions,
    isCapturing,
    error
  };
};