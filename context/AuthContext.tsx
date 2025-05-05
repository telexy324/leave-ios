import { authApi } from '@/lib/auth';
import { AccountInfo, LoginDto } from "@/types/nestapi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface AuthContextType {
  user: AccountInfo | null;
  token: string | null;
  perms: string[] | null;
  isAuthenticated: boolean;
  login: (params: LoginDto) => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  setUser: (user: AccountInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [perms, setPerms] = useState<string[] | null>(null);

  const setToken = useCallback(async (newToken: string) => {
    setTokenState(newToken);
    await AsyncStorage.setItem('token', newToken);
  }, []);

  const login = useCallback(async (params: LoginDto) => {
    try {
      const response = await authApi.login(params);
      if (!response || !response.token) {
        throw new Error('登录失败：未获取到有效的token');
      }
      const { token: newToken } = response;
      await setToken(newToken);
      const user = await authApi.getCurrentUser();
      if (!user) {
        throw new Error('登录失败：未获取到用户信息');
      }
      const perms = await authApi.getCurrentUserPerm();
      setUser(user);
      setPerms(perms);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [setToken]);

  const logout = useCallback(async () => {
    setTokenState(null);
    setUser(null);
    setPerms(null);
    await AsyncStorage.removeItem('token');
  }, []);

  const getToken = useCallback(async () => {
    if (token) return token;
    return await AsyncStorage.getItem('token');
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
  getToken: async () => await AsyncStorage.getItem('token'),
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
};