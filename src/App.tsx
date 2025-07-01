import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthProvider from './components/auth/AuthProvider';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';
import MobileOptimizations from './components/mobile/MobileOptimizations';
import ToastContainer from './components/ui/ToastContainer';
import ErrorBoundary from './utils/errorBoundary';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Cargando MaxFra Academy...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthScreen />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MobileOptimizations>
          <AppContent />
          <ToastContainer />
        </MobileOptimizations>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;