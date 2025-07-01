import React from 'react';
import Toast from './Toast';
import { useToast } from '../../hooks/useToast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;