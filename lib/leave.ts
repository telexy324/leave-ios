import api from './api';

export interface LeaveRequest {
  id: string;
  applicant: {
    id: string;
    name: string;
    department: string;
  };
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  comment?: string;
  documents?: string[];
}

export interface CreateLeaveRequestParams {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  documents?: string[];
}

export interface UpdateLeaveRequestParams {
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  documents?: string[];
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export const leaveApi = {
  // 创建请假申请
  createLeaveRequest: (params: CreateLeaveRequestParams) => {
    return api.post<LeaveRequest>('/leave/requests', params);
  },

  // 获取请假申请列表
  getLeaveRequests: (params?: {
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get<LeaveRequest[]>('/leave/requests', { params });
  },

  // 获取请假申请详情
  getLeaveRequest: (id: string) => {
    return api.get<LeaveRequest>(`/leave/requests/${id}`);
  },

  // 更新请假申请
  updateLeaveRequest: (id: string, params: UpdateLeaveRequestParams) => {
    return api.put<LeaveRequest>(`/leave/requests/${id}`, params);
  },

  // 取消请假申请
  cancelLeaveRequest: (id: string) => {
    return api.post(`/leave/requests/${id}/cancel`);
  },

  // 审批请假申请
  approveLeaveRequest: (id: string, comment?: string) => {
    return api.post(`/leave/requests/${id}/approve`, { comment });
  },

  // 拒绝请假申请
  rejectLeaveRequest: (id: string, comment: string) => {
    return api.post(`/leave/requests/${id}/reject`, { comment });
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