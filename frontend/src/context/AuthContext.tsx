import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import API from '../services/api';
import { useToast } from './ToastContext';
import { SESSION_EVENT, readSession, storeSession, endSession, tokenExpiry } from '../utils/authSession';

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
interface AuthSession { token: string; user: AuthUser; }
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (name: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession());
  const { showToast } = useToast();
  const token = session?.token;

  useEffect(() => {
    const ended = (event: Event) => {
      setSession(null);
      const reason = (event as CustomEvent).detail?.reason;
      if (reason === 'logout') showToast('Signed out successfully.', 'info');
      else showToast('Your session ended. Please sign in again.', 'warning');
    };
    const changed = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user' || event.key === null) setSession(readSession());
    };
    window.addEventListener(SESSION_EVENT, ended);
    window.addEventListener('storage', changed);
    if (!readSession() && localStorage.getItem('token')) endSession('expired');
    return () => {
      window.removeEventListener(SESSION_EVENT, ended);
      window.removeEventListener('storage', changed);
    };
  }, [showToast]);

  useEffect(() => {
    if (!token) return;
    let stopped = false;
    const verify = async () => {
      if (localStorage.getItem('token') !== token) return;
      if (tokenExpiry(token) <= Date.now()) { endSession('expired'); return; }
      try {
        const { data } = await API.get('/auth/me');
        if (!stopped && localStorage.getItem('token') === token) {
          const current = { token, user: data.user };
          storeSession(current);
          setSession(current);
        }
      } catch { /* The API interceptor clears only rejected authentication. */ }
    };
    void verify();
    window.addEventListener('focus', verify);
    const timer = window.setTimeout(() => {
      if (localStorage.getItem('token') === token) endSession('expired');
    }, Math.max(0, Math.min(tokenExpiry(token) - Date.now(), 2147483647)));
    return () => { stopped = true; window.clearTimeout(timer); window.removeEventListener('focus', verify); };
  }, [token]);

  const save = (value: AuthSession) => { storeSession(value); setSession(value); return value; };
  const login = async (email: string, password: string): Promise<AuthSession> => save(await loginUser(email.trim(), password));
  const register = async (name: string, email: string, password: string): Promise<AuthSession> => save(await registerUser(name.trim(), email.trim(), password));
  const logout = () => { endSession('logout', true); setSession(null); };

  return <AuthContext.Provider value={{
    user: session?.user || null,
    isAuthenticated: !!session,
    isAdmin: session?.user.role === 'admin',
    login, register, logout,
  }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
