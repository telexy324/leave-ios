export const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'bg-yellow-100 text-yellow-600';
    case 2:
      return 'bg-green-100 text-green-600';
    case 3:
      return 'bg-red-100 text-red-600';
    case 4:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-yellow-100 text-yellow-600';
  }
};

export const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '待审批';
    case 2:
      return '已通过';
    case 3:
      return '已驳回';
    case 4:
      return '已取消';
    default:
      return '待审批';
  }
};

export const getLeaveTypeText = (type: number) => {
  switch (type) {
    case 1:
      return '调休';
    case 2:
      return '年假';
    case 3:
      return '病假';
    case 4:
      return '事假';
    case 5:
      return '其他';
    default:
      return '其他';
  }
};