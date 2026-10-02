import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string, role?: 'admin' | 'creator') => boolean;
  register: (name: string, email: string, role?: 'creator' | 'vendor') => boolean;
  logout: () => void;
  switchDemoRole: (role: 'admin' | 'creator') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  // Default to logged-in creator for immediate rich experience
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cinevault_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_USERS[0];
      }
    }
    return MOCK_USERS[0]; // Janaka Bandara
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cinevault_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cinevault_user');
    }
  }, [user]);

  const login = (email: string, _password?: string, preferredRole?: 'admin' | 'creator'): boolean => {
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
      return true;
    }
    // Generic fallback login with dynamic profile
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: preferredRole || (email.includes('admin') ? 'admin' : 'creator'),
      verified: true,
      memberSince: 'October 2026',
      credits: 200
    };
    setUser(newUser);
    showToast(`Welcome to CineVault, ${newUser.name}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, role: 'creator' | 'vendor' = 'creator'): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      verified: true,
      memberSince: 'October 2026',
      credits: 100
    };
    setUser(newUser);
    showToast(`Account created! Welcome aboard, ${name}.`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out successfully.', 'info');
  };

  const switchDemoRole = (role: 'admin' | 'creator') => {
    if (role === 'admin') {
      setUser(MOCK_USERS[1]);
      showToast('Switched to Admin account (Vault Administrator)', 'info');
    } else {
      setUser(MOCK_USERS[0]);
      showToast('Switched to Creator account (Janaka Bandara)', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
