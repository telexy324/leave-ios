declare namespace API {
  type IdParams = {
    id: number;
  };

  type LeaveListParams = {
    page?: number;
    pageSize?: number;
    field?: string;
    order?: 'ASC' | 'DESC';
    type?: 1 | 2 | 3 | 4 | 5;
    status?: 1 | 2 | 3;
    startDate?: string;
    endDate?: string;
    _t?: number;
  };

  type PageResponse<T> = {
    items: T[];
    meta: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }

  type TableListResult<T = any> = {
    items?: T;
    meta?: PaginationResult;
  };

  /** 全局通用表格分页返回数据结构 */
  type PaginationResult = {
    itemCount?: number;
    totalItems?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };

  /** 全局通用表格分页请求参数 */
  type PageParams<T = any> = {
    page?: number;
    pageSize?: number;
  } & {
    [P in keyof T]?: T[P];
  };

  type UploadResponse = {
    filename: string
  }
}
