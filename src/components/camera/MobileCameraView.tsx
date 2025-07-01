import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Loader2 } from 'lucide-react';
import { FacialMeasurements } from '../../types';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { FaceMesh, Results } from '@mediapipe/face_mesh';

interface MobileCameraViewProps {
  onMeasurementsReady: (measurements: FacialMeasurements) => void;
}

const MobileCameraView: React.FC<MobileCameraViewProps> = ({ onMeasurementsReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState<FacialMeasurements | null>(null);
  const [noFace, setNoFace] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start camera and live analysis
  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      setIsActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError('No se pudo acceder a la cámara.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setNoFace(false);
    setMeasurements(null);
    if (animationRef.current) window.clearTimeout(animationRef.current);
  };

  // Live analysis effect
  useEffect(() => {
    if (!isActive || !videoRef.current) return;
    let running = true;
    setNoFace(false);

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

    function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
      return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    const analyzeFrame = async () => {
      if (!running || !videoRef.current) return;
      setIsAnalyzing(true);
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      await new Promise((resolve) => {
        faceMesh.onResults((results: Results) => {
          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setNoFace(true);
            setMeasurements(null);
          } else {
            setNoFace(false);
            const landmarks = results.multiFaceLandmarks[0];
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
      animationRef.current = window.setTimeout(analyzeFrame, 100);
    };
    analyzeFrame();
    return () => {
      running = false;
      if (animationRef.current) window.clearTimeout(animationRef.current);
    };
  }, [isActive, onMeasurementsReady]);

  useEffect(() => {
    return () => {
      if (animationRef.current) window.clearTimeout(animationRef.current);
      stopCamera();
    };
    // eslint-disable-next-line
  }, []);

  // Fallback: if getUserMedia is not available, show photo mode
  const isLiveSupported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  if (!isLiveSupported) {
    return (
      <GlassCard className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Modo en vivo no soportado</h3>
          <p className="text-white/70">Tu dispositivo no soporta análisis facial en vivo. Usa la función de foto.</p>
        </div>
      </GlassCard>
    );
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
              <Smartphone className="w-16 h-16 text-white/50 mx-auto mb-4" />
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
                <Smartphone className="w-8 h-8 text-red-400" />
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
      </div>
    </GlassCard>
  );
};

export default MobileCameraView;