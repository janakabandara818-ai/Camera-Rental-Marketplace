import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  company?: string;
  verified?: boolean;
  memberSince?: string;
  credits?: number;
}

interface AuthSession {
  token: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readSavedUser(): AuthUser | null {
  try {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      return null;
    }

    const parsed = JSON.parse(savedUser);

    if (
      typeof parsed?.id !== 'string' ||
      typeof parsed?.name !== 'string' ||
      typeof parsed?.email !== 'string' ||
      !['user', 'admin'].includes(parsed?.role)
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(readSavedUser);

  const saveSession = (session: AuthSession): AuthSession => {
    localStorage.setItem('token', session.token);
    localStorage.setItem('user', JSON.stringify(session.user));
    localStorage.removeItem('cinevault_user');

    setUser(session.user);

    return session;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthSession> => {
    const session = await loginUser(email.trim(), password);
    return saveSession(session);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthSession> => {
    const session = await registerUser(
      name.trim(),
      email.trim(),
      password
    );

    return saveSession(session);
  };

  const logout = () => {
    [
      'token',
      'user',
      'cart',
      'cinevault_user',
      'cinevault_cart',
      'cinevault_rentals',
      'cinevault_orders',
      'cinevault_wishlist',
    ].forEach((key) => {
      localStorage.removeItem(key);
    });

    setUser(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}