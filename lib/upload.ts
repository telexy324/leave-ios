import { request, RequestOptions } from './api';

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

  // 删除文件
  // deleteFile: (filename: string) => {
  //   return api.delete(`/upload/${filename}`);
  // },

  // 获取文件信息
  // getFileInfo: (filename: string) => {
  //   return api.get<UploadResponse>(`/upload/${filename}`);
  // },

  uploadFile(body: API.FileUploadDto, file?: File, options?: RequestOptions) {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    Object.keys(body).forEach((ele) => {
      const item = (body as any)[ele];

      if (item !== undefined && item !== null) {
        if (typeof item === 'object' && !(item instanceof File)) {
          if (item instanceof Array) {
            item.forEach((f) => formData.append(ele, f || ''));
          } else {
            formData.append(ele, JSON.stringify(item));
          }
        } else {
          formData.append(ele, item);
        }
      }
    });

    return request<string>('/api/tools/upload', {
      method: 'POST',
      data: formData,
      requestType: 'form',
      ...(options || {}),
    });
  }
}; 