// 格式化时间函数
export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 添加日期格式化函数
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
  const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  // 如果时间差小于等于0，返回0
  if (diffInHours <= 0) return 0;

  // 计算完整的天数
  const fullDays = Math.floor(diffInHours / 24);

  // 计算剩余的小时数
  const remainingHours = diffInHours % 24;

  // 如果剩余时间超过8小时，算作一天
  if (remainingHours >= 8) {
    return fullDays + 1;
  }

  // 如果剩余时间不足8小时，按小时计算
  return fullDays + Math.floor(remainingHours / 8);
};