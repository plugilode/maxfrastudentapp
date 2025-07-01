import React, { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Eye } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useCamera } from '../../hooks/useCamera';
import { FacialMeasurements } from '../../types';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { FaceMesh, Results, NormalizedLandmark } from '@mediapipe/face_mesh';
import BrowSimulator from './BrowSimulator';
import MobileCameraView from './MobileCameraView';

interface CameraViewProps {
  onMeasurementsReady: (measurements: FacialMeasurements) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onMeasurementsReady }) => {
  const { isActive, videoRef, error, startCamera, stopCamera } = useCamera();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState<FacialMeasurements | null>(null);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>([]);
  const [noFace, setNoFace] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const animationRef = useRef<number | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);

  // Start live analysis when camera is active
  useEffect(() => {
    if (!isActive || !videoRef.current) return;
    let running = true;
    setNoFace(false);

    // Setup MediaPipe FaceMesh
    if (!faceMeshRef.current) {
      faceMeshRef.current = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });
      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
    }
    const faceMesh = faceMeshRef.current;

    // Helper: Calculate distance between two points
    function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
      return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    // Main loop
    const analyzeFrame = async () => {
      if (!running || !videoRef.current) return;
      setIsAnalyzing(true);
      const video = videoRef.current;
      // Draw current frame to canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Run FaceMesh
      await new Promise((resolve) => {
        faceMesh.onResults((results: Results) => {
          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setNoFace(true);
            setMeasurements(null);
            setLandmarks([]);
          } else {
            setNoFace(false);
            const landmarks = results.multiFaceLandmarks[0];
            setLandmarks(landmarks);
            // Indices for eyebrows, eyes, face width
            const leftBrowStart = landmarks[70];
            const leftBrowArch = landmarks[105];
            const leftBrowEnd = landmarks[107];
            const leftEyeInner = landmarks[133];
            const rightEyeInner = landmarks[362];
            const faceLeft = landmarks[234];
            const faceRight = landmarks[454];
            const thickness = distance(leftBrowStart, leftBrowArch);
            const angle = Math.atan2(leftBrowArch.y - leftBrowStart.y, leftBrowArch.x - leftBrowStart.x) * (180 / Math.PI);
            const facialWidth = distance(faceLeft, faceRight);
            const eyeDistance = distance(leftEyeInner, rightEyeInner);
            const recommendations = [
              angle > 10 ? 'Arched brow recommended' : 'Natural brow recommended',
              thickness > 10 ? 'Reduce thickness for balance' : 'Good thickness',
              'Align brow start with inner eye corner',
              'End brow at outer eye corner'
            ];
            const m: FacialMeasurements = {
              id: Date.now().toString(),
              userId: '1',
              eyebrowStart: { x: leftBrowStart.x * canvas.width, y: leftBrowStart.y * canvas.height },
              eyebrowArch: { x: leftBrowArch.x * canvas.width, y: leftBrowArch.y * canvas.height },
              eyebrowEnd: { x: leftBrowEnd.x * canvas.width, y: leftBrowEnd.y * canvas.height },
              thickness: Math.round(thickness * canvas.width),
              angle: Math.round(angle),
              facialWidth: Math.round(facialWidth * canvas.width),
              eyeDistance: Math.round(eyeDistance * canvas.width),
              recommendations,
              createdAt: new Date()
            };
            setMeasurements(m);
            onMeasurementsReady(m);
          }
          resolve(true);
        });
        faceMesh.send({ image: canvas });
      });
      setIsAnalyzing(false);
      // Next frame (throttle to ~10fps)
      animationRef.current = window.setTimeout(analyzeFrame, 100);
    };
    analyzeFrame();
    return () => {
      running = false;
      if (animationRef.current) window.clearTimeout(animationRef.current);
    };
  }, [isActive, videoRef, onMeasurementsReady]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) window.clearTimeout(animationRef.current);
    };
  }, []);

  if (Capacitor.isNativePlatform()) {
    // For mobile, use the mobile-specific camera view
    return <MobileCameraView onMeasurementsReady={onMeasurementsReady} />;
  }

  return (
    <GlassCard className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Análisis Facial (En Vivo)</h3>
        <p className="text-white/70">
          Posiciona tu rostro en el centro de la cámara para obtener medidas precisas en tiempo real
        </p>
      </div>

      <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden mb-6">
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white/70 mb-4">Cámara desactivada</p>
              <Button onClick={startCamera} variant="primary">
                Activar Cámara
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={startCamera} variant="secondary">
                Intentar Nuevamente
              </Button>
            </div>
          </div>
        )}

        {isActive && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Overlay: show spinner if no face, or measurements if detected */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                </div>
              )}
              {noFace && !isAnalyzing && (
                <div className="bg-black/60 rounded-lg px-6 py-3 text-white/80 text-lg">No se detectó rostro</div>
              )}
              {measurements && !noFace && !isAnalyzing && (
                <div className="bg-black/60 rounded-lg px-6 py-3 text-white/80 text-lg">
                  <div>Grosor: {measurements.thickness} px</div>
                  <div>Ángulo: {measurements.angle}°</div>
                  <div>Ancho facial: {measurements.facialWidth} px</div>
                  <div>Distancia entre ojos: {measurements.eyeDistance} px</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {isActive && (
          <Button onClick={stopCamera} variant="secondary" disabled={isAnalyzing}>
            Detener Cámara
          </Button>
        )}
        {/* Simulate Brows Button */}
        {isActive && measurements && landmarks.length > 0 && !noFace && (
          <Button
            onClick={() => setShowSimulator(true)}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Eye className="w-5 h-5" /> Simular Cejas
          </Button>
        )}
      </div>

      {/* Brow Simulator Modal */}
      {showSimulator && isActive && measurements && landmarks.length > 0 && (
        <BrowSimulator
          image={videoRef.current!}
          landmarks={landmarks}
          onClose={() => setShowSimulator(false)}
        />
      )}
    </GlassCard>
  );
};

export default CameraView;