import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useTranslation } from '../../i18n';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { addUser, isLoading } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = t('register.firstName');
    if (!formData.lastName) newErrors.lastName = t('register.lastName');
    if (!formData.email) newErrors.email = t('register.email');
    if (!formData.password) newErrors.password = t('register.password');
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.confirmPassword');
    }
    if (formData.password.length < 6) {
      newErrors.password = t('register.password') + ' (6+)';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await addUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: 'student',
      password: formData.password
    });

    if (!success) {
      setErrors({ general: t('register.exists') });
    } else {
      setSuccessMsg(t('register.success'));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('register.title')}</h2>
        <p className="text-white/70">{t('register.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {errors.general}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder={t('register.firstName')}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={errors.firstName}
          />
          <Input
            type="text"
            placeholder={t('register.lastName')}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={errors.lastName}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            type="email"
            placeholder={t('register.email')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            className="pl-12"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('register.password')}
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

        <Input
          type="password"
          placeholder={t('register.confirmPassword')}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          size="lg"
          variant="primary"
        >
          {t('register.button')}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/20 text-center">
        <p className="text-white/60 text-sm">
          {t('register.login').split('Sign in')[0]}
          <button
            onClick={onSwitchToLogin}
            className="text-teal-300 hover:text-teal-200 font-medium"
          >
            {t('register.login').includes('Sign in') ? 'Sign in' : 'Iniciar sesión'}
          </button>
        </p>
      </div>
    </GlassCard>
  );
};

export default RegisterForm;