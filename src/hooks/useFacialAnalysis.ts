import { useState, useCallback } from 'react';
import { FacialMeasurements } from '../types';
import { FaceMesh } from '@mediapipe/face_mesh';

// Helper: Convert base64 image to HTMLImageElement
function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

// Helper: Calculate distance between two points
function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export const useFacialAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState<FacialMeasurements | null>(null);

  // Main facial analysis function using MediaPipe
  const analyzeFace = useCallback(async (imageData: string): Promise<FacialMeasurements | null> => {
    setIsAnalyzing(true);
    try {
      // Load image from base64
      const img = await loadImage(imageData);
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');
      ctx.drawImage(img, 0, 0);

      // Prepare MediaPipe FaceMesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // Run FaceMesh on the image
      const results = await new Promise<any>((resolve, reject) => {
        faceMesh.onResults(resolve);
        faceMesh.send({ image: canvas });
      });

      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        setMeasurements(null);
        return null;
      }

      // Get the first face's landmarks
      const landmarks = results.multiFaceLandmarks[0];
      // MediaPipe FaceMesh landmark indices for eyebrows and eyes
      // (see: https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg)
      const leftBrowStart = landmarks[70];
      const leftBrowArch = landmarks[105];
      const leftBrowEnd = landmarks[107];
      const rightBrowStart = landmarks[336];
      const rightBrowArch = landmarks[334];
      const rightBrowEnd = landmarks[276];
      const leftEyeInner = landmarks[133];
      const rightEyeInner = landmarks[362];
      const faceLeft = landmarks[234];
      const faceRight = landmarks[454];

      // Calculate measurements (example: left brow)
      const thickness = distance(leftBrowStart, leftBrowArch);
      const angle = Math.atan2(leftBrowArch.y - leftBrowStart.y, leftBrowArch.x - leftBrowStart.x) * (180 / Math.PI);
      const facialWidth = distance(faceLeft, faceRight);
      const eyeDistance = distance(leftEyeInner, rightEyeInner);

      // Recommendations (simple demo)
      const recommendations = [
        angle > 10 ? 'Arched brow recommended' : 'Natural brow recommended',
        thickness > 10 ? 'Reduce thickness for balance' : 'Good thickness',
        'Align brow start with inner eye corner',
        'End brow at outer eye corner'
      ];

      const result: FacialMeasurements = {
        id: Date.now().toString(),
        userId: '1',
        eyebrowStart: { x: leftBrowStart.x * img.width, y: leftBrowStart.y * img.height },
        eyebrowArch: { x: leftBrowArch.x * img.width, y: leftBrowArch.y * img.height },
        eyebrowEnd: { x: leftBrowEnd.x * img.width, y: leftBrowEnd.y * img.height },
        thickness: Math.round(thickness * img.width),
        angle: Math.round(angle),
        facialWidth: Math.round(facialWidth * img.width),
        eyeDistance: Math.round(eyeDistance * img.width),
        recommendations,
        createdAt: new Date()
      };
      setMeasurements(result);
      return result;
    } catch (error) {
      console.error('Analysis error:', error);
      setMeasurements(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurements(null);
  }, []);

  return {
    isAnalyzing,
    measurements,
    analyzeFace,
    clearMeasurements
  };
};