import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { CheckCircle, XCircle, RefreshCw, User } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { users, approveUser, declineUser, resetPassword } = useAuth();
  const [resetInfo, setResetInfo] = useState<{ user: string; password: string } | null>(null);

  const handleApprove = (id: string) => approveUser(id);
  const handleDecline = (id: string) => declineUser(id);
  const handleReset = (id: string) => {
    const newPass = resetPassword(id);
    if (newPass) setResetInfo({ user: id, password: newPass });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">Panel de Administración</h2>
        </div>
        <p className="text-white/70 mb-2">Gestión de usuarios: aprobar, denegar acceso y restablecer contraseñas.</p>
      </GlassCard>
      <GlassCard className="p-6">
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 text-left">Nombre</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2">Aprobado</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => !u.isAdmin).map(user => (
              <tr key={user.id} className="border-b border-white/10">
                <td className="py-2">{user.firstName} {user.lastName}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2 text-center">
                  {user.isApproved ? (
                    <CheckCircle className="w-5 h-5 text-green-400 inline" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 inline" />
                  )}
                </td>
                <td className="py-2 flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant={user.isApproved ? 'secondary' : 'primary'}
                    onClick={() => user.isApproved ? handleDecline(user.id) : handleApprove(user.id)}
                  >
                    {user.isApproved ? 'Denegar' : 'Aprobar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReset(user.id)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />Reset
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resetInfo && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
            Nueva contraseña para usuario <b>{resetInfo.user}</b>: <span className="font-mono">{resetInfo.password}</span>
            <button className="ml-4 text-purple-300 underline" onClick={() => setResetInfo(null)}>Cerrar</button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminDashboard; 