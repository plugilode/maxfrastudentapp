import React from 'react';
import { Play, Clock, CheckCircle, Lock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  isCompleted: boolean;
  isLocked: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
}

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lessonId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart }) => {
  const difficultyColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  };

  const difficultyLabels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };

  return (
    <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
      <div className="relative">
        {lesson.isLocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <Lock className="w-8 h-8 text-white/70" />
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
            <p className="text-white/70 text-sm mb-3">{lesson.description}</p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-white/60">
                <Clock className="w-4 h-4 mr-1" />
                {lesson.duration} min
              </div>
              <span className={`${difficultyColors[lesson.difficulty]} font-medium`}>
                {difficultyLabels[lesson.difficulty]}
              </span>
            </div>
          </div>
          
          {lesson.isCompleted && (
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={() => onStart(lesson.id)}
            disabled={lesson.isLocked}
            variant={lesson.isCompleted ? 'secondary' : 'primary'}
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {lesson.isCompleted ? 'Repasar' : 'Comenzar'}
          </Button>
          
          <div className="w-full bg-white/20 rounded-full h-1 mx-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all"
              style={{ width: lesson.isCompleted ? '100%' : '0%' }}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default LessonCard;