import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <GlassCard className="p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Algo salió mal
            </h2>
            
            <p className="text-white/70 mb-6">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente.
            </p>

            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-white/60 text-sm cursor-pointer mb-2">
                  Detalles técnicos
                </summary>
                <pre className="bg-black/20 p-3 rounded text-xs text-white/60 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recargar aplicación
              </Button>
              
              <Button
                onClick={() => this.setState({ hasError: false, error: null })}
                variant="secondary"
                className="w-full"
              >
                Intentar de nuevo
              </Button>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;