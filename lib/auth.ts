import { AccountInfo, LoginDto, LoginToken, PasswordUpdateDto, RegisterDto } from "@/types/nestapi";
import api from './api';

export const authApi = {
  // 用户登录
  login: (params: LoginDto): Promise<LoginToken> => {
    return api.post<LoginToken>('/api/auth/login', params);
  },

  // 用户注册
  register: (params: RegisterDto): Promise<void> => {
    return api.post('/api/auth/register', params);
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<AccountInfo> => {
    return api.get<AccountInfo>('/api/account/profile');
  },

  // 修改密码
  changePassword: (params: PasswordUpdateDto): Promise<void> => {
    return api.post('/api/account/password', params);
  },

  // 重置密码
  // resetPassword: (email: string): Promise<void> => {
  //   return api.post('/auth/reset-password', { email });
  // },

  // 登出
  logout: (): Promise<void> => {
    return api.post('/api/account/logout');
  },

  // 获取当前用户信息
  getCurrentUserPerm: (): Promise<string[]> => {
    return api.get<string[]>('/api/account/permissions');
  },
};