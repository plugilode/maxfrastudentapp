import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'
  };

  const Icon = icons[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out mb-2
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        ${colors[type]} backdrop-blur-lg border rounded-lg p-4 shadow-lg max-w-sm w-full
      `}>
        <div className="flex items-start">
          <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{title}</h4>
            {message && <p className="text-sm mt-1 opacity-90 break-words">{message}</p>}
          </div>
          <button
            onClick={handleClose}
            className="ml-2 hover:opacity-70 flex-shrink-0"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;