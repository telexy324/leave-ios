import { LeaveBalance } from '@/lib/leave';
import { LeaveDto, LeaveEntity, LeaveUpdateDto, LeaveStats, LeaveApprovalStats } from '@/types/nestapi';
import { request, RequestOptions } from './api';

export const leaveBalanceApi = {
  // 创建请假申请
  createLeaveRequest: (body: LeaveDto, options?: RequestOptions) => {
    return request<void>('/api/leaves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || { successMsg: '创建成功' }),
    });
  },

  // 获取请假申请列表
  getLeaveRequests: (
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.LeaveListParams,
    options?: RequestOptions,
  )=> {
    return request<{
      items?: LeaveEntity[];
      meta?: {
        itemCount?: number;
        totalItems?: number;
        itemsPerPage?: number;
        totalPages?: number;
        currentPage?: number;
      };
    }>('/api/leaves', {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  },

  // 获取请假申请详情
  getLeaveRequest: (
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.IdParams,
    options?: RequestOptions,
  )=> {
      const { id: param0, ...queryParams } = params;
      return request<LeaveEntity>(`/api/leaves/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
      });
  },

  // 更新请假申请
  updateLeaveRequest: (
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: API.IdParams,
    body: LeaveUpdateDto,
    options?: RequestOptions,
  )=> {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/leaves/${param0}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || { successMsg: '更新成功' }),
    });
  },

  // 取消请假申请
  cancelLeaveRequest: (
    params: API.IdParams,
    options?: RequestOptions,
  ) => {
    const { id: param0, ...queryParams } = params;
    return request<void>(`/api/leaves/${param0}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(options || { successMsg: '取消成功' }),
    });
  },

  // 审批请假申请
  approveLeaveRequest: (
    params: API.IdParams,
    body: LeaveUpdateDto,
    options?: RequestOptions,
  )=> {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/leaves/${param0}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || { successMsg: '审批成功' }),
    });
  },

  // 拒绝请假申请
  rejectLeaveRequest: (
    params: API.IdParams,
    body: LeaveUpdateDto,
    options?: RequestOptions,
  )=> {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/leaves/${param0}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || { successMsg: '驳回成功' }),
    });
  },

  // 获取请假总数统计
  getLeaveStats: (options?: RequestOptions) => {
    return request<LeaveStats>(`/api/leaves/stats`, {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 获取审批总数统计
  getLeaveApprovalStats: (options?: RequestOptions) => {
    return request<LeaveApprovalStats>(`/api/leaves/approvals`, {
      method: 'GET',
      ...(options || {}),
    });
  },

  // 获取请假余额
  // getLeaveBalance: () => {
  //   return api.get<LeaveBalance[]>('/leaves/balance');
  // },

  // 获取请假统计
  // getLeaveStatistics: (params?: {
  //   startDate: string;
  //   endDate: string;
  //   departmentId?: string;
  // }) => {
  //   return api.get('/leaves/statistics', { params });
  // },

  // 获取请假日历数据
  // getLeaveCalendar: (params?: {
  //   startDate: string;
  //   endDate: string;
  //   departmentId?: string;
  // }) => {
  //   return api.get('/leaves/calendar', { params });
  // },
};