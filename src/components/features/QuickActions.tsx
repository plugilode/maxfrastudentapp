import React from 'react';
import { Camera, BookOpen, Trophy, Settings, Share2, Download } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface QuickActionsProps {
  onAnalysis: () => void;
  onLessons: () => void;
  onAchievements: () => void;
  onSettings: () => void;
  onShare: () => void;
  onExport: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAnalysis,
  onLessons,
  onAchievements,
  onSettings,
  onShare,
  onExport
}) => {
  const actions = [
    {
      icon: Camera,
      label: 'Nuevo Análisis',
      description: 'Analizar rostro con IA',
      colorBg: 'bg-purple-500/20',
      colorIcon: 'text-purple-400',
      onClick: onAnalysis
    },
    {
      icon: BookOpen,
      label: 'Continuar Lección',
      description: 'Seguir aprendiendo',
      colorBg: 'bg-rose-500/20',
      colorIcon: 'text-rose-400',
      onClick: onLessons
    },
    {
      icon: Trophy,
      label: 'Logros',
      description: 'Ver progreso',
      colorBg: 'bg-amber-500/20',
      colorIcon: 'text-amber-400',
      onClick: onAchievements
    },
    {
      icon: Settings,
      label: 'Configuración',
      description: 'Ajustar preferencias',
      colorBg: 'bg-slate-500/20',
      colorIcon: 'text-slate-400',
      onClick: onSettings
    },
    {
      icon: Share2,
      label: 'Compartir',
      description: 'Resultados de análisis',
      colorBg: 'bg-blue-500/20',
      colorIcon: 'text-blue-400',
      onClick: onShare
    },
    {
      icon: Download,
      label: 'Exportar',
      description: 'Descargar datos',
      colorBg: 'bg-green-500/20',
      colorIcon: 'text-green-400',
      onClick: onExport
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <GlassCard 
          key={index}
          className="p-4 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-white/20"
          onClick={action.onClick}
        >
          <div className="text-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${action.colorBg} flex items-center justify-center`}>
              <action.icon className={`w-6 h-6 ${action.colorIcon}`} />
            </div>
            
            <h3 className="text-white font-semibold mb-1">{action.label}</h3>
            <p className="text-white/60 text-xs">{action.description}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default QuickActions;