import api from './api';

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  rules: {
    maxDaysPerRequest?: number;
    maxDaysPerYear?: number;
    minDaysPerRequest?: number;
    requireApproval: boolean;
    requireDocument: boolean;
    allowedDays?: string[];
    excludedDays?: string[];
  };
}

export interface CreateLeaveTypeParams {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  rules: {
    maxDaysPerRequest?: number;
    maxDaysPerYear?: number;
    minDaysPerRequest?: number;
    requireApproval: boolean;
    requireDocument: boolean;
    allowedDays?: string[];
    excludedDays?: string[];
  };
}

export interface UpdateLeaveTypeParams {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  rules?: {
    maxDaysPerRequest?: number;
    maxDaysPerYear?: number;
    minDaysPerRequest?: number;
    requireApproval?: boolean;
    requireDocument?: boolean;
    allowedDays?: string[];
    excludedDays?: string[];
  };
}

export const leaveTypeApi = {
  // 获取请假类型列表
  getLeaveTypes: (params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return api.get<{
      data: LeaveType[];
      total: number;
      page: number;
      pageSize: number;
    }>('/leave-types', { params });
  },

  // 获取请假类型详情
  getLeaveType: (id: string) => {
    return api.get<LeaveType>(`/leave-types/${id}`);
  },

  // 创建请假类型
  createLeaveType: (params: CreateLeaveTypeParams) => {
    return api.post<LeaveType>('/leave-types', params);
  },

  // 更新请假类型
  updateLeaveType: (id: string, params: UpdateLeaveTypeParams) => {
    return api.put<LeaveType>(`/leave-types/${id}`, params);
  },

  // 删除请假类型
  deleteLeaveType: (id: string) => {
    return api.delete(`/leave-types/${id}`);
  },

  // 获取部门请假类型配置
  getDepartmentLeaveTypes: (departmentId: string) => {
    return api.get<LeaveType[]>(`/departments/${departmentId}/leave-types`);
  },

  // 更新部门请假类型配置
  updateDepartmentLeaveTypes: (departmentId: string, leaveTypeIds: string[]) => {
    return api.put(`/departments/${departmentId}/leave-types`, { leaveTypeIds });
  },
}; 