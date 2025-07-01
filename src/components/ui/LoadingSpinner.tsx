import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'purple' | 'pink';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'white',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    white: 'text-white',
    purple: 'text-purple-400',
    pink: 'text-pink-400'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color]}/80`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;