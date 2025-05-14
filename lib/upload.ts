import { request, RequestOptions } from './api';
import { Storage } from '@/types/nestapi';

// export interface UploadResponse {
//   url: string;
//   filename: string;
//   size: number;
//   mimeType: string;
// }

export const uploadApi = {
  // 上传文件
  // uploadFile: (file: File, type: 'document' | 'avatar') => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('type', type);
  //
  //   return api.post<UploadResponse>('/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // },

  // 上传多个文件
  // uploadMultipleFiles: (files: File[], type: 'document' | 'avatar') => {
  //   const formData = new FormData();
  //   files.forEach(file => {
  //     formData.append('files', file);
  //   });
  //   formData.append('type', type);
  //
  //   return api.post<UploadResponse[]>('/upload/multiple', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // },

  deleteFile(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.IdParams,
    options?: RequestOptions,
  ) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/tools/upload/${param0}`, {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || { successMsg: '删除成功' }),
    });
  },

  // 获取文件信息
  // getFileInfo: (filename: string) => {
  //   return api.get<UploadResponse>(`/upload/${filename}`);
  // },

  uploadFile(file: { uri: string; type: string; name: string }, options?: RequestOptions) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file as any);
    }

    return request<Storage>('/api/tools/upload/mobile', {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    });
  }
}; 