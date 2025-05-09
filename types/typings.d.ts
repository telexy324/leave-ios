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
}
