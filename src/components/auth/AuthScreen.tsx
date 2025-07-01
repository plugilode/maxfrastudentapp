import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import GlassCard from '../ui/GlassCard';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from '../admin/AdminDashboard';
import { useTranslation } from '../../i18n';

type AuthMode = 'login' | 'register' | 'reset';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { user } = useAuth();
  const { lang, setLang } = useTranslation();

  // If admin, show admin dashboard
  if (user && user.isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
          className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-purple-500/30 border border-white/20 font-semibold shadow"
        >
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">MaxFra Academy</h1>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Domina el Arte del
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Microblading
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Tecnología de análisis facial avanzado para crear cejas perfectas. 
              Aprende con los mejores profesionales y herramientas de última generación.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <GlassCard className="p-6 text-center" variant="purple">
                <div className="text-2xl font-bold text-white mb-2">IA Avanzada</div>
                <div className="text-white/70 text-sm">Análisis facial preciso</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center" variant="rose">
                <div className="text-2xl font-bold text-white mb-2">AR 3D</div>
                <div className="text-white/70 text-sm">Visualización realista</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center" variant="teal">
                <div className="text-2xl font-bold text-white mb-2">Expertos</div>
                <div className="text-white/70 text-sm">Instructores certificados</div>
              </GlassCard>
            </div>
          </div>

          {/* Auth Form Section */}
          <div className="flex justify-center">
            {mode === 'login' && (
              <LoginForm
                onSwitchToRegister={() => setMode('register')}
                onSwitchToReset={() => setMode('reset')}
              />
            )}
            {mode === 'register' && (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
            {mode === 'reset' && (
              <GlassCard className="w-full max-w-md p-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Recuperar Contraseña</h3>
                  <p className="text-white/70 mb-6">
                    Te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  <button
                    onClick={() => setMode('login')}
                    className="text-purple-300 hover:text-purple-200"
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;