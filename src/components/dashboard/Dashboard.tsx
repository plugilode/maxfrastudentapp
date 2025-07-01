import React, { useState } from 'react';
import { Camera, BookOpen, User, LogOut, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import CameraView from '../camera/CameraView';
import MeasurementResults from '../analysis/MeasurementResults';
import Settings from '../features/Settings';
import ProgressStats from '../features/ProgressStats';
import QuickActions from '../features/QuickActions';
import LessonCard from '../features/LessonCard';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { FacialMeasurements } from '../../types';

type DashboardView = 'home' | 'analysis' | 'results' | 'lessons' | 'profile' | 'settings';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [measurements, setMeasurements] = useState<FacialMeasurements | null>(null);

  const handleMeasurementsReady = (newMeasurements: FacialMeasurements) => {
    setMeasurements(newMeasurements);
    setCurrentView('results');
  };

  const handleStartOver = () => {
    setMeasurements(null);
    setCurrentView('analysis');
    success('Nuevo análisis iniciado', 'Posiciona tu rostro en el centro');
  };

  const handleLessonStart = () => {
    success('Lección iniciada', 'Preparando contenido...');
  };

  const mockLessons = [
    {
      id: '1',
      title: 'Fundamentos del Microblading',
      description: 'Aprende los conceptos básicos y herramientas necesarias',
      duration: 45,
      isCompleted: true,
      isLocked: false,
      difficulty: 'beginner' as const
    },
    {
      id: '2',
      title: 'Análisis Facial Avanzado',
      description: 'Técnicas profesionales de medición y diseño',
      duration: 60,
      isCompleted: false,
      isLocked: false,
      difficulty: 'intermediate' as const
    },
    {
      id: '3',
      title: 'Técnicas de Sombreado',
      description: 'Masterclass de efectos y acabados realistas',
      duration: 90,
      isCompleted: false,
      isLocked: true,
      difficulty: 'advanced' as const
    }
  ];

  const navigation = [
    { id: 'home', label: 'Inicio', icon: Sparkles },
    { id: 'analysis', label: 'Análisis Facial', icon: Camera },
    { id: 'lessons', label: 'Lecciones', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation Header */}
      <nav className="border-b border-white/10 backdrop-blur-lg bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">MaxFra Academy</h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as DashboardView)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm">
                Hola, {user?.firstName}
              </span>
              <Button onClick={logout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Bienvenida a tu Academia de Microblading
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Utiliza nuestra tecnología de análisis facial para crear diseños perfectos
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentView('analysis')}>
                <Camera className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Análisis Facial</h3>
                <p className="text-white/70">
                  Utiliza la IA para obtener medidas precisas y recomendaciones personalizadas
                </p>
              </GlassCard>

              <GlassCard className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentView('lessons')}>
                <BookOpen className="w-12 h-12 text-rose-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Lecciones</h3>
                <p className="text-white/70">
                  Accede a contenido educativo y tutoriales paso a paso
                </p>
              </GlassCard>

              <GlassCard className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentView('profile')}>
                <User className="w-12 h-12 text-teal-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Mi Progreso</h3>
                <p className="text-white/70">
                  Revisa tu avance y estadísticas de aprendizaje
                </p>
              </GlassCard>
            </div>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Actividad Reciente</h3>
              <div className="space-y-4">
                {/* Progress Stats */}
                <ProgressStats
                  completedLessons={5}
                  totalLessons={12}
                  practiceHours={15}
                  skillLevel="Intermedio"
                  streakDays={7}
                />

                {/* Quick Actions */}
                <QuickActions
                  onAnalysis={() => setCurrentView('analysis')}
                  onLessons={() => setCurrentView('lessons')}
                  onAchievements={() => success('Logros', 'Función próximamente disponible')}
                  onSettings={() => setCurrentView('settings')}
                  onShare={() => success('Compartir', 'Función próximamente disponible')}
                  onExport={() => success('Exportar', 'Función próximamente disponible')}
                />
              </div>
            </GlassCard>
          </div>
        )}

        {currentView === 'analysis' && (
          <CameraView onMeasurementsReady={handleMeasurementsReady} />
        )}

        {currentView === 'results' && measurements && (
          <MeasurementResults 
            measurements={measurements} 
            onStartOver={handleStartOver}
          />
        )}

        {currentView === 'lessons' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Lecciones</h2>
                <p className="text-white/70">Domina el arte del microblading paso a paso</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={handleLessonStart}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <GlassCard className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-white/70">{user?.email}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Información Personal</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Nombre</label>
                      <div className="text-white">{user?.firstName}</div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Apellido</label>
                      <div className="text-white">{user?.lastName}</div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Email</label>
                      <div className="text-white">{user?.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Progreso de Aprendizaje</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Lecciones completadas</span>
                      <span className="text-white font-semibold">5/12</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-white/70">Horas de práctica</span>
                      <span className="text-white font-semibold">15h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {currentView === 'settings' && <Settings />}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as DashboardView)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === item.id ? 'text-white' : 'text-white/60'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;