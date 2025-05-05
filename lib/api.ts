import { AuthContextStatic } from '@/context/AuthContext';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

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

type ResOp = {
  data: Record<string, any>;
  code: number;
  message: string;
};

type BaseResponse<T = any> = Omit<ResOp, 'data'> & {
  data: T;
};

enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
}

const UNKNOWN_ERROR = '未知错误，请重试';

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    const token = await AuthContextStatic.getToken();
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
  // <T>(response: AxiosResponse<T>) => response.data,
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data;

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== ResultEnum.SUCCESS) {
      // throw other
      const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any };
      error.code = res.code;
      return Promise.reject(error);
    } else {
      return response;
    }
  },
  (error) => {
    // if (error.response?.code === 401) {
    //   // 处理未授权错误
    //   AuthContextStatic.logout();
    // }
    return Promise.reject(error);
  }
);

export default api;