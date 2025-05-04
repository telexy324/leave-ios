import api from './api';

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: {
    id: string;
    name: string;
  };
  employeeCount: number;
  leaveQuota: {
    annual: number;
    sick: number;
    personal: number;
  };
}

export interface CreateDepartmentParams {
  name: string;
  description?: string;
  managerId?: string;
  leaveQuota: {
    annual: number;
    sick: number;
    personal: number;
  };
}

export interface UpdateDepartmentParams {
  name?: string;
  description?: string;
  managerId?: string;
  leaveQuota?: {
    annual?: number;
    sick?: number;
    personal?: number;
  };
}

export const departmentApi = {
  // 获取部门列表
  getDepartments: (params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return api.get<{
      data: Department[];
      total: number;
      page: number;
      pageSize: number;
    }>('/departments', { params });
  },

  // 获取部门详情
  getDepartment: (id: string) => {
    return api.get<Department>(`/departments/${id}`);
  },

  // 创建部门
  createDepartment: (params: CreateDepartmentParams) => {
    return api.post<Department>('/departments', params);
  },

  // 更新部门
  updateDepartment: (id: string, params: UpdateDepartmentParams) => {
    return api.put<Department>(`/departments/${id}`, params);
  },

  // 删除部门
  deleteDepartment: (id: string) => {
    return api.delete(`/departments/${id}`);
  },

  // 获取部门员工列表
  getDepartmentEmployees: (id: string, params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return api.get(`/departments/${id}/employees`, { params });
  },

  // 添加员工到部门
  addEmployeeToDepartment: (departmentId: string, employeeId: string) => {
    return api.post(`/departments/${departmentId}/employees`, { employeeId });
  },

  // 从部门移除员工
  removeEmployeeFromDepartment: (departmentId: string, employeeId: string) => {
    return api.delete(`/departments/${departmentId}/employees/${employeeId}`);
  },
}; 