import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../../types';

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
      // TODO: conectar con API real
      // Mock login para desarrollo
      const mockUsers: Record<string, User> = {
        'admin@worindev.com': {
          id: '1', email, role: UserRole.ADMIN,
          name: 'Administrador', lastName: 'Worindev', isActive: true,
        },
        'empresa@worindev.com': {
          id: '2', email, role: UserRole.EMPRESA,
          name: 'TechCorp', lastName: 'SAS', isActive: true,
          companyName: 'TechCorp SAS', sector: 'Tecnología',
        },
        'candidato@worindev.com': {
          id: '3', email, role: UserRole.CANDIDATO,
          name: 'Juan', lastName: 'Pérez', isActive: true,
          phone: '3001234567', city: 'Medellín',
          skills: ['React', 'TypeScript', 'Node.js'],
        },
      };

      const found = mockUsers[email];
      if (found && password.length >= 6) {
        const token = 'mock_token_' + Date.now();
        localStorage.setItem(SESSION_KEYS.TOKEN, token);
        localStorage.setItem(SESSION_KEYS.USER, JSON.stringify(found));
        setUser(found);
        return true;
      }
      return false;
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
