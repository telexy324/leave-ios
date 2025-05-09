import { leaveBalanceApi } from '@/lib/leaveBalance';
import { useAuthStore } from '@/lib/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 格式化时间函数
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  // 使用 React Query 获取假期统计
  const { data: leaveStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
  });

  // 使用 React Query 获取最近请假记录
  const { data: leaveRecent, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['leaveRecent'],
    queryFn: () => leaveBalanceApi.getLeaveRequests({

    }),
  });

  // 如果数据正在加载，可以显示加载状态
  if (isLoadingStats || isLoadingRecent) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 用户信息卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-xl font-bold mb-2">你好，{user?.username}</Text>
          <Text className="text-gray-600">员工编号：{user?.employeeId}</Text>
          <Text className="text-gray-600">部门：{user?.department}</Text>
        </View>

        {/* 请假统计卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">请假统计</Text>
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">
                {(leaveStats?.totalAnnualLeaves || 0) - (leaveStats?.usedAnnualLeaves || 0)}
              </Text>
              <Text className="text-gray-600">年假剩余</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">
                {(leaveStats?.totalSickLeaves || 0) - (leaveStats?.usedSickLeaves || 0)}
              </Text>
              <Text className="text-gray-600">病假剩余</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">
                {(leaveStats?.totalCompensatoryLeaves || 0) - (leaveStats?.usedCompensatoryLeaves || 0)}
              </Text>
              <Text className="text-gray-600">调休剩余</Text>
            </View>
          </View>
        </View>

        {/* 快捷操作卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">快捷操作</Text>
          <View className="flex-row justify-between">
            {/* 申请请假按钮 */}
            <TouchableOpacity
              className="w-[30%] aspect-square bg-blue-500 rounded-lg justify-center items-center shadow-sm"
              onPress={() => router.push('/(tabs)/leave-request/new' as any)}
            >
              <Ionicons name="calendar-outline" size={28} color="white" style={{ marginBottom: 8 }} />
              <Text className="text-white font-bold text-sm">申请请假</Text>
            </TouchableOpacity>

            {/* 查看日历按钮 */}
            <TouchableOpacity
              className="w-[30%] aspect-square bg-green-500 rounded-lg justify-center items-center shadow-sm"
              onPress={() => router.push('/(tabs)/calendar' as any)}
            >
              <Ionicons name="calendar-number-outline" size={28} color="white" style={{ marginBottom: 8 }} />
              <Text className="text-white font-bold text-sm">查看日历</Text>
            </TouchableOpacity>

            {/* 个人信息按钮 */}
            <TouchableOpacity
              className="w-[30%] aspect-square bg-purple-500 rounded-lg justify-center items-center shadow-sm"
              onPress={() => router.push('/(tabs)/profile' as any)}
            >
              <Ionicons name="person-outline" size={28} color="white" style={{ marginBottom: 8 }} />
              <Text className="text-white font-bold text-sm">个人信息</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 最近请假记录 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">最近请假记录</Text>
          {leaveRecent?.items?.map((request, index) => (
            <TouchableOpacity
              key={request.id}
              className={`bg-white rounded-lg p-5 mb-4 shadow-sm ${
                index !== (leaveRecent?.items?.length || 1) - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={() => router.push(`/leave-request/${request.id}`)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-bold">
                  {request.type === 1
                    ? '调休'
                    : request.type === 2
                    ? '年假'
                    : request.type === 3
                    ? '病假'
                    : request.type === 4
                    ? '事假'
                    : '其他'}
                </Text>
                <View
                  className={`px-3 py-1 rounded ${
                    request.status === 2
                      ? 'bg-green-100'
                      : request.status === 3
                      ? 'bg-red-100'
                      : request.status === 4
                      ? 'bg-gray-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      request.status === 2
                        ? 'text-green-600'
                        : request.status === 3
                        ? 'text-red-600'
                        : request.status === 4
                        ? 'text-gray-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {request.status === 2
                      ? '已通过'
                      : request.status === 3
                      ? '已驳回'
                      : request.status === 4
                      ? '已取消'
                      : '待审批'}
                  </Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">请假时间</Text>
                  <Text className="font-bold flex-1 text-right" numberOfLines={1}>
                    {formatDateTime(request.startDate)} 至 {formatDateTime(request.endDate)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">请假天数</Text>
                  <Text className="font-bold flex-1 text-right">
                    {request.amount} 天
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">申请时间</Text>
                  <Text className="font-bold flex-1 text-right">
                    {formatDateTime(request.createdAt)}
                  </Text>
                </View>
                {request.reason && (
                  <View>
                    <Text className="text-gray-600 mb-1">请假原因</Text>
                    <Text className="text-base" numberOfLines={2}>{request.reason}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 