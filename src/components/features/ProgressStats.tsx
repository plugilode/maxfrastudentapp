import React from 'react';
import { Award, Clock, Target, TrendingUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

interface ProgressStatsProps {
  completedLessons: number;
  totalLessons: number;
  practiceHours: number;
  skillLevel: string;
  streakDays: number;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  completedLessons,
  totalLessons,
  practiceHours,
  skillLevel,
  streakDays
}) => {
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  const stats = [
    {
      icon: Target,
      label: 'Progreso',
      value: `${completedLessons}/${totalLessons}`,
      percentage: completionPercentage,
      colorBg: 'bg-purple-500/20',
      colorIcon: 'text-purple-400',
      colorGradient: 'from-purple-500 to-purple-400'
    },
    {
      icon: Clock,
      label: 'Horas de práctica',
      value: `${practiceHours}h`,
      colorBg: 'bg-rose-500/20',
      colorIcon: 'text-rose-400'
    },
    {
      icon: Award,
      label: 'Nivel actual',
      value: skillLevel,
      colorBg: 'bg-teal-500/20',
      colorIcon: 'text-teal-400'
    },
    {
      icon: TrendingUp,
      label: 'Racha de días',
      value: `${streakDays} días`,
      colorBg: 'bg-orange-500/20',
      colorIcon: 'text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <GlassCard key={index} className="p-4 text-center">
          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${stat.colorBg}`}>
            <stat.icon className={`w-6 h-6 ${stat.colorIcon}`} />
          </div>
          
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </div>
          
          <div className="text-white/70 text-sm">
            {stat.label}
          </div>
          
          {stat.percentage !== undefined && (
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${stat.colorGradient} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
              <div className="text-xs text-white/60 mt-1">{stat.percentage}%</div>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
};

export default ProgressStats;