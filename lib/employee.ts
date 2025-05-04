import api from './api';

export interface Employee {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  department: {
    id: string;
    name: string;
  };
  position?: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive';
  joinDate: string;
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
}

export interface CreateEmployeeParams {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  departmentId: string;
  position?: string;
  role?: 'admin' | 'employee';
}

export interface UpdateEmployeeParams {
  name?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  role?: 'admin' | 'employee';
  status?: 'active' | 'inactive';
}

export const employeeApi = {
  // 获取员工列表
  getEmployees: (params?: {
    search?: string;
    departmentId?: string;
    role?: 'admin' | 'employee';
    status?: 'active' | 'inactive';
    page?: number;
    pageSize?: number;
  }) => {
    return api.get<{
      data: Employee[];
      total: number;
      page: number;
      pageSize: number;
    }>('/employees', { params });
  },

  // 获取员工详情
  getEmployee: (id: string) => {
    return api.get<Employee>(`/employees/${id}`);
  },

  // 创建员工
  createEmployee: (params: CreateEmployeeParams) => {
    return api.post<Employee>('/employees', params);
  },

  // 更新员工信息
  updateEmployee: (id: string, params: UpdateEmployeeParams) => {
    return api.put<Employee>(`/employees/${id}`, params);
  },

  // 删除员工
  deleteEmployee: (id: string) => {
    return api.delete(`/employees/${id}`);
  },

  // 重置员工密码
  resetEmployeePassword: (id: string) => {
    return api.post(`/employees/${id}/reset-password`);
  },

  // 获取员工请假记录
  getEmployeeLeaveRequests: (id: string, params?: {
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return api.get(`/employees/${id}/leave-requests`, { params });
  },

  // 获取员工请假统计
  getEmployeeLeaveStatistics: (id: string, params?: {
    startDate: string;
    endDate: string;
  }) => {
    return api.get(`/employees/${id}/leave-statistics`, { params });
  },

  // 更新员工请假余额
  updateEmployeeLeaveBalance: (id: string, params: {
    type: 'annual' | 'sick' | 'personal';
    days: number;
  }) => {
    return api.put(`/employees/${id}/leave-balance`, params);
  },
}; 