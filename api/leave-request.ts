// 获取请假记录列表
export const getLeaveRequests = async (params: {
  page: number;
  pageSize: number;
  status?: LeaveStatus;
}) => {
  const response = await api.get<PaginatedResponse<LeaveRequest>>('/leave-requests', {
    params,
  });
  return response.data;
};

// 获取请假记录详情
export const getLeaveRequest = async (id: number) => {
  const response = await api.get<LeaveRequest>(`/leave-requests/${id}`);
  return response.data;
}; 