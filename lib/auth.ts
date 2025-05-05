import { AccountInfo, LoginDto, LoginToken, PasswordUpdateDto, RegisterDto } from "@/types/nestapi";
import { request, RequestOptions } from './api';

export const authApi = {
  // 用户登录
  login: (body: LoginDto, options?: RequestOptions): Promise<LoginToken> => {
    return request<LoginToken>('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  },

  // // 用户注册
  // register: (params: RegisterDto): Promise<void> => {
  //   return api.post('/api/auth/register', params);
  // },

  // 获取当前用户信息
  getCurrentUser: (options?: RequestOptions): Promise<AccountInfo> => {
    return request<AccountInfo>('/api/account/profile', {
      method: 'GET',
      ...(options || {}),
    });
  },

  // // 修改密码
  // changePassword: (params: PasswordUpdateDto): Promise<void> => {
  //   return api.post('/api/account/password', params);
  // },

  // 重置密码
  // resetPassword: (email: string): Promise<void> => {
  //   return api.post('/auth/reset-password', { email });
  // },

  // 登出
  logout: (options?: RequestOptions): Promise<void> => {
    return request<any>('/api/account/logout', {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 获取当前用户信息
  getCurrentUserPerm: (options?: RequestOptions): Promise<string[]> => {
    return request<string[]>('/api/account/permissions', {
      method: 'GET',
      ...(options || {}),
    });
  },
};