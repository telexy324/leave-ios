import { useAuthStore } from '@/lib/store/auth';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';

// 创建自定义的axios实例类型
// interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> {
//   get<T = any>(url: string, config?: any): Promise<T>;
//   post<T = any>(url: string, data?: any, config?: any): Promise<T>;
//   put<T = any>(url: string, data?: any, config?: any): Promise<T>;
//   delete<T = any>(url: string, config?: any): Promise<T>;
// }

const controller = new AbortController();
const service = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://172.20.10.7:7001',
  // adapter: 'fetch',
  timeout: 10000,
  signal: controller.signal,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  },
});

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

export interface RequestOptions extends AxiosRequestConfig {
  /** 是否直接将数据从响应中提取出，例如直接返回 res.data，而忽略 res.code 等信息 */
  isReturnResult?: boolean;
  /** 请求成功是提示信息 */
  successMsg?: string;
  /** 请求失败是提示信息 */
  errorMsg?: string;
  /** 成功时，是否显示后端返回的成功信息 */
  showSuccessMsg?: boolean;
  /** 失败时，是否显示后端返回的失败信息 */
  showErrorMsg?: boolean;
  requestType?: 'json' | 'form';
}

// 请求拦截器
service.interceptors.request.use(
  async (config) => {
    const token = await useAuthStore.getState().getToken();
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
service.interceptors.response.use(
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
    if (error.response?.status === 401) {
      // 处理未授权错误
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function request<T = any>(
  url: string,
  config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>;
export function request<T = any>(
  url: string,
  config: RequestOptions,
): Promise<BaseResponse<T>['data']>;
export function request<T = any>(
  config: { isReturnResult: false } & RequestOptions,
): Promise<BaseResponse<T>>;
export function request<T = any>(config: RequestOptions): Promise<BaseResponse<T>['data']>;
/**
 *
 * @param url - request url
 * @param config - AxiosRequestConfig
 */
export async function request(_url: string | RequestOptions, _config: RequestOptions = {}) {
  const url = isString(_url) ? _url : _url.url;
  const config = isString(_url) ? _config : _url;
  try {
    // 兼容 from data 文件上传的情况
    const { requestType, isReturnResult = true, ...rest } = config;

    const response = (await service.request({
      url,
      ...rest,
      headers: {
        ...rest.headers,
        ...(requestType === 'form' ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    })) as AxiosResponse<BaseResponse>;
    const { data } = response;

    // 页面代码需要获取 code，data，message 等信息时，需要将 isReturnResult 设置为 false
    if (!isReturnResult) {
      return data;
    } else {
      return data.data;
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
}
