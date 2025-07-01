import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  approveUser: (userId: string) => void;
  declineUser: (userId: string) => void;
  resetPassword: (userId: string) => string | null;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'isApproved' | 'isAdmin'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_EMAIL = 'admin@maxfraacademy.com';

function seedAdmin() {
  const users = JSON.parse(localStorage.getItem('maxfra_users') || '[]');
  let changed = false;
  if (!users.find((u: User) => u.isAdmin)) {
    const admin: User = {
      id: 'admin',
      email: ADMIN_EMAIL,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      isApproved: true,
      isAdmin: true
    };
    users.push({ ...admin, password: ADMIN_PASSWORD });
    changed = true;
  }
  // Seed demo users
  if (!users.find((u: User) => u.email === 'demo1@maxfraacademy.com')) {
    users.push({
      id: 'demo1',
      email: 'demo1@maxfraacademy.com',
      firstName: 'Demo',
      lastName: 'Aprobado',
      role: 'student',
      createdAt: new Date(),
      isApproved: true,
      isAdmin: false,
      password: 'demo123'
    });
    changed = true;
  }
  if (!users.find((u: User) => u.email === 'demo2@maxfraacademy.com')) {
    users.push({
      id: 'demo2',
      email: 'demo2@maxfraacademy.com',
      firstName: 'Demo',
      lastName: 'Pendiente',
      role: 'student',
      createdAt: new Date(),
      isApproved: false,
      isAdmin: false,
      password: 'demo123'
    });
    changed = true;
  }
  if (changed) {
    localStorage.setItem('maxfra_users', JSON.stringify(users));
  }
}

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    seedAdmin();
    const storedUsers = JSON.parse(localStorage.getItem('maxfra_users') || '[]');
    setUsers(storedUsers);
    const storedUser = localStorage.getItem('maxfra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUsers = (newUsers: any[]) => {
    setUsers(newUsers);
    localStorage.setItem('maxfra_users', JSON.stringify(newUsers));
  };

  const login = async (username: string, password: string, isAdmin = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('maxfra_users') || '[]');
      const found = storedUsers.find((u: any) =>
        (isAdmin ? u.isAdmin : !u.isAdmin) &&
        (u.email === username || u.id === username) &&
        u.password === password
      );
      if (!found) return false;
      if (!found.isApproved && !found.isAdmin) return false;
      setUser(found);
      localStorage.setItem('maxfra_user', JSON.stringify(found));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('maxfra_user');
  };

  const approveUser = (userId: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, isApproved: true } : u);
    saveUsers(updated);
  };

  const declineUser = (userId: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, isApproved: false } : u);
    saveUsers(updated);
  };

  const resetPassword = (userId: string): string | null => {
    const newPass = Math.random().toString(36).slice(-8);
    const updated = users.map(u =>
      u.id === userId ? { ...u, password: newPass } : u
    );
    saveUsers(updated);
    return newPass;
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isApproved' | 'isAdmin'>): Promise<boolean> => {
    const exists = users.find(u => u.email === userData.email);
    if (exists) return false;
    const newUser: any = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isApproved: false,
      isAdmin: false,
      password: userData.password
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    return true;
  };

  return {
    user,
    login,
    logout,
    isLoading,
    users,
    approveUser,
    declineUser,
    resetPassword,
    addUser
  };
};

export { AuthContext };