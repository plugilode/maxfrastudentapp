import React from 'react';
import { Ruler, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { FacialMeasurements } from '../../types';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

interface MeasurementResultsProps {
  measurements: FacialMeasurements;
  onStartOver: () => void;
}

const MeasurementResults: React.FC<MeasurementResultsProps> = ({ 
  measurements, 
  onStartOver 
}) => {
  const { success } = useToast();

  const handleSave = () => {
    success('Resultados guardados', 'Análisis guardado en tu perfil');
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-green-400 mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">Análisis Completado</h3>
            <p className="text-white/70">Medidas y recomendaciones personalizadas</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Measurements */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Ruler className="w-5 h-5 mr-2 text-purple-400" />
              Medidas Principales
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Grosor recomendado:</span>
                <span className="text-white font-semibold">{measurements.thickness}mm</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Ángulo de arco:</span>
                <span className="text-white font-semibold">{measurements.angle}°</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Ancho facial:</span>
                <span className="text-white font-semibold">{measurements.facialWidth}mm</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-white/80">Distancia entre ojos:</span>
                <span className="text-white font-semibold">{measurements.eyeDistance}mm</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-rose-400" />
              Recomendaciones
            </h4>
            
            <div className="space-y-3">
              {measurements.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Visual Guide */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Guía Visual</h4>
        
        <div className="relative bg-gradient-to-b from-purple-900/20 to-blue-900/20 rounded-xl p-8 aspect-video">
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            {/* Face outline */}
            <ellipse
              cx="200"
              cy="150"
              rx="120"
              ry="150"
              fill="none"
              stroke="rgba(139, 92, 246, 0.6)"
              strokeWidth="2"
            />
            
            {/* Eyebrow guidelines with measurements */}
            <g className="eyebrow-left">
              <path
                d="M 140 120 Q 168 105 192 126"
                fill="none"
                stroke="rgba(245, 158, 11, 1)"
                strokeWidth="3"
              />
              <circle cx="140" cy="120" r="3" fill="#F59E0B" />
              <circle cx="168" cy="105" r="3" fill="#F59E0B" />
              <circle cx="192" cy="126" r="3" fill="#F59E0B" />
            </g>
            
            <g className="eyebrow-right">
              <path
                d="M 208 126 Q 232 105 260 120"
                fill="none"
                stroke="rgba(245, 158, 11, 1)"
                strokeWidth="3"
              />
              <circle cx="208" cy="126" r="3" fill="#F59E0B" />
              <circle cx="232" cy="105" r="3" fill="#F59E0B" />
              <circle cx="260" cy="120" r="3" fill="#F59E0B" />
            </g>
            
            {/* Measurement lines */}
            <line x1="140" y1="120" x2="192" y2="126" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="208" y1="126" x2="260" y2="120" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="1" strokeDasharray="2,2" />
            
            {/* Labels */}
            <text x="100" y="90" fill="white" fontSize="12" className="font-medium">Inicio</text>
            <text x="152" y="75" fill="white" fontSize="12" className="font-medium">Arco</text>
            <text x="268" y="90" fill="white" fontSize="12" className="font-medium">Final</text>
          </svg>
        </div>
      </GlassCard>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={onStartOver} variant="secondary" size="lg">
          Nuevo Análisis
        </Button>
        <Button onClick={handleSave} variant="primary" size="lg">
          Guardar Resultados
        </Button>
      </div>
    </div>
  );
};

export default MeasurementResults;