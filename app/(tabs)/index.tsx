import { leaveBalanceApi } from '@/lib/leaveBalance';
import { useAuthStore } from '@/lib/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  // 使用 React Query 获取假期统计
  const { data: leaveStats, isLoading } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
  });

  // 如果数据正在加载，可以显示加载状态
  if (isLoading) {
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
        <View className="bg-white rounded-lg shadow-sm mx-4 mt-4 p-4">
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
        <View className="bg-white rounded-lg shadow-sm mx-4 mt-4 p-4">
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
        <View className="bg-white rounded-lg shadow-sm mx-4 mt-4 p-4 mb-4">
          <Text className="text-lg font-bold mb-4">最近请假记录</Text>
          {leaveStats?.recentRequests?.map((request, index) => (
            <TouchableOpacity
              key={request.id}
              className={`flex-row justify-between items-center py-3 ${
                index !== leaveStats.recentRequests.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onPress={() => router.push(`/leave-request/${request.id}`)}
            >
              <View>
                <Text className="font-bold">{request.type}</Text>
                <Text className="text-sm text-gray-600">
                  {request.startDate} 至 {request.endDate}
                </Text>
              </View>
              <View
                className={`px-2.5 py-1 rounded ${
                  request.status === 'approved'
                    ? 'bg-success/10'
                    : request.status === 'rejected'
                    ? 'bg-danger/10'
                    : 'bg-warning/10'
                }`}
              >
                <Text
                  className={`text-sm ${
                    request.status === 'approved'
                      ? 'text-success'
                      : request.status === 'rejected'
                      ? 'text-danger'
                      : 'text-warning'
                  }`}
                >
                  {request.status === 'approved'
                    ? '已通过'
                    : request.status === 'rejected'
                    ? '已驳回'
                    : '待审批'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 