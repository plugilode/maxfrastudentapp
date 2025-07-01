import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'purple' | 'rose' | 'teal';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  variant = 'default' 
}) => {
  const variantClasses = {
    default: 'bg-white/10 border-white/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    rose: 'bg-rose-500/10 border-rose-500/20',
    teal: 'bg-teal-500/10 border-teal-500/20'
  };

  return (
    <div className={`
      ${variantClasses[variant]}
      backdrop-blur-lg border rounded-xl shadow-2xl
      transition-all duration-300 hover:shadow-3xl hover:bg-white/15
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;