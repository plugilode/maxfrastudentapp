import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useTranslation } from '../../i18n';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToReset }) => {
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = t('login.email');
    if (!formData.password) newErrors.password = t('login.password');
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await login(formData.username, formData.password, isAdmin);
    if (!success) {
      setErrors({ general: isAdmin ? t('login.adminError') : t('login.error') });
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center relative">
          <Lock className="w-8 h-8 text-white" />
          <button
            type="button"
            onClick={() => setIsAdmin((v) => !v)}
            className="absolute -bottom-2 -right-2 bg-white/20 rounded-full p-1 hover:bg-purple-500/40 transition"
            title={t('login.admin')}
          >
            <Shield className={`w-5 h-5 ${isAdmin ? 'text-purple-400' : 'text-white/60'}`} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{isAdmin ? t('login.admin') : t('login.title')}</h2>
        <p className="text-white/70">{isAdmin ? t('login.admin') : t('login.email')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {errors.general}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            type="text"
            placeholder={isAdmin ? 'admin' : t('login.email')}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={errors.username}
            className="pl-12"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('login.password')}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            className="pl-12 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          {isAdmin ? t('login.adminButton') : t('login.button')}
        </Button>
      </form>

      {!isAdmin && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="text-center space-y-2">
            <button
              onClick={onSwitchToReset}
              className="text-purple-300 hover:text-purple-200 text-sm"
            >
              {t('login.forgot')}
            </button>
            <p className="text-white/60 text-sm">
              {t('login.register').split('Register here')[0]}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-300 hover:text-purple-200 font-medium"
              >
                {t('login.register').includes('Register here') ? 'Register here' : 'Regístrate aquí'}
              </button>
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default LoginForm;