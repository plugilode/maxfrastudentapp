import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Camera, 
  Palette, 
  Shield, 
  Bell,
  Download,
  Trash2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    highQuality: true,
    language: 'es',
    theme: 'dark'
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'camera', label: 'Cámara', icon: Camera },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell }
  ];

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <SettingsIcon className="w-8 h-8 text-purple-400 mr-3" />
        <h2 className="text-3xl font-bold text-white">Configuración</h2>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Información Personal</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={user?.firstName || ''}
                    placeholder="Tu nombre"
                  />
                  <Input
                    label="Apellido"
                    value={user?.lastName || ''}
                    placeholder="Tu apellido"
                  />
                </div>
                
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={user?.email || ''}
                  placeholder="correo@ejemplo.com"
                />
                
                <div className="flex gap-4">
                  <Button variant="primary">Guardar Cambios</Button>
                  <Button variant="secondary">Cancelar</Button>
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Configuración de Cámara</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Calidad alta</label>
                      <p className="text-white/60 text-sm">Usar la máxima resolución disponible</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.highQuality}
                        onChange={(e) => handleSettingChange('highQuality', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Guardado automático</label>
                      <p className="text-white/60 text-sm">Guardar análisis automáticamente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Apariencia</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Idioma</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Tema</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleSettingChange('theme', 'dark')}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          settings.theme === 'dark'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <div className="text-white font-medium">Oscuro</div>
                        <div className="text-white/60 text-sm">Tema predeterminado</div>
                      </button>
                      <button
                        onClick={() => handleSettingChange('theme', 'light')}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          settings.theme === 'light'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        <div className="text-white font-medium">Claro</div>
                        <div className="text-white/60 text-sm">Próximamente</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Notificaciones</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Notificaciones push</label>
                      <p className="text-white/60 text-sm">Recibir notificaciones en el dispositivo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Privacidad y Datos</h3>
                
                <div className="space-y-4">
                  <Button variant="secondary" className="w-full justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar mis datos
                  </Button>
                  
                  <Button variant="danger" className="w-full justify-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar cuenta
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/20">
              <Button
                onClick={logout}
                variant="ghost"
                className="w-full justify-center text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;