import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '@/lib/auth';
import { AccountInfo, LoginDto } from "@/types/nestapi";

interface AuthContextType {
  user: AccountInfo | null;
  token: string | null;
  perms: string[] | null;
  isAuthenticated: boolean;
  login: (params: LoginDto) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  setToken: (token: string) => void;
  setUser: (user: AccountInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [perms, setPerms] = useState<string[] | null>(null);

  const login = useCallback(async (params: LoginDto) => {
    try {
      const response = await authApi.login(params);
      // axios 响应已经被拦截器处理，直接返回 data
      const { token: newToken } = response;
      const user = await authApi.getCurrentUser();
      const perms = await authApi.getCurrentUserPerm();
      setToken(newToken);
      setUser(user);
      setPerms(perms);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setPerms(null);
    localStorage.removeItem('token');
  }, []);

  const getToken = useCallback(() => {
    return token || localStorage.getItem('token');
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    perms,
    isAuthenticated: !!token,
    login,
    logout,
    getToken,
    setToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 导出静态方法供API拦截器使用
export const AuthContextStatic = {
  getToken: () => localStorage.getItem('token'),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};