import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { AuthContextStatic } from '@/context/AuthContext';

// 创建自定义的axios实例类型
interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = AuthContextStatic.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      AuthContextStatic.logout();
    }
    return Promise.reject(error);
  }
);

export default api;