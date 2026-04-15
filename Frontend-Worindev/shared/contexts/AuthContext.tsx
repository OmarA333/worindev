import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../../types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3003';

interface AuthContextType {
  user:            User | null;
  isLoading:       boolean;
  login:           (email: string, password: string) => Promise<boolean>;
  logout:          () => void;
  isAuthenticated: boolean;
  updateUser:      (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEYS = { TOKEN: 'wrd_token', USER: 'wrd_user' } as const;

const ROL_MAP: Record<string, UserRole> = {
  ADMIN:     UserRole.ADMIN,
  EMPRESA:   UserRole.EMPRESA,
  CANDIDATO: UserRole.CANDIDATO,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]           = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem(SESSION_KEYS.TOKEN);
    const userData = localStorage.getItem(SESSION_KEYS.USER);
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem(SESSION_KEYS.TOKEN);
        localStorage.removeItem(SESSION_KEYS.USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const { token, usuario } = data;

      const rolMap: Record<string, UserRole> = {
        ADMIN:     UserRole.ADMIN,
        EMPRESA:   UserRole.EMPRESA,
        CANDIDATO: UserRole.CANDIDATO,
      };

      const [firstName, ...rest] = (usuario.nombre ?? '').split(' ');

      const user: User = {
        id:       String(usuario.id),
        email:    usuario.email,
        role:     rolMap[usuario.rol] ?? UserRole.CANDIDATO,
        name:     firstName ?? usuario.email,
        lastName: rest.join(' '),
        isActive: true,
      };

      localStorage.setItem(SESSION_KEYS.TOKEN, token);
      localStorage.setItem(SESSION_KEYS.USER,  JSON.stringify(user));
      setUser(user);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem(SESSION_KEYS.USER);
    setUser(null);
  };

  const updateUser = (partial: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, logout,
      isAuthenticated: !!user,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
