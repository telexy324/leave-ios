import { LeaveBalance } from '@/lib/leave';
import api from './api'
import { LeaveDto, LeaveEntity, LeaveUpdateDto } from '@/types/nestapi';

export const leaveBalanceApi = {
  // 创建请假申请
  createLeaveRequest: (params: LeaveDto) => {
    return api.post<LeaveEntity>('/leave', params);
  },

  // 获取请假申请列表
  getLeaveRequests: (params?: {
    type?: 1 | 2 | 3 | 4 | 5;
    status?: 1 | 2 | 3;
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get<LeaveEntity[]>('/leave', { params });
  },

  // 获取请假申请详情
  getLeaveRequest: (id: string) => {
    return api.get<LeaveEntity>(`/leave/${id}`);
  },

  // 更新请假申请
  updateLeaveRequest: (id: string, params: LeaveUpdateDto) => {
    return api.put<LeaveEntity>(`/leave/${id}`, params);
  },

  // 取消请假申请
  cancelLeaveRequest: (id: string) => {
    return api.post(`/leave/${id}/cancel`);
  },

  // 审批请假申请
  approveLeaveRequest: (id: string, comment?: string) => {
    return api.post(`/leave/${id}/approve`, { comment });
  },

  // 拒绝请假申请
  rejectLeaveRequest: (id: string, comment: string) => {
    return api.post(`/leave/${id}/reject`, { comment });
  },

  // 获取请假余额
  getLeaveBalance: () => {
    return api.get<LeaveBalance[]>('/leave/balance');
  },

  // 获取请假统计
  getLeaveStatistics: (params?: {
    startDate: string;
    endDate: string;
    departmentId?: string;
  }) => {
    return api.get('/leave/statistics', { params });
  },

  // 获取请假日历数据
  getLeaveCalendar: (params?: {
    startDate: string;
    endDate: string;
    departmentId?: string;
  }) => {
    return api.get('/leave/calendar', { params });
  },
};