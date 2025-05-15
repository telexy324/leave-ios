import { LeaveRequestCard } from '@/components/app/LeaveRequestCard';
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
  const isAdmin = user?.isAdmin;

  // 普通用户的查询
  const { data: leaveStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
    enabled: !isAdmin, // 只有非管理员才获取
  });

  // 管理员的查询
  const { data: approvalStats, isLoading: isLoadingApprovalStats } = useQuery({
    queryKey: ['approvalStats'],
    queryFn: () => leaveBalanceApi.getLeaveApprovalStats(),
    enabled: isAdmin, // 只有管理员才获取
  });

  // 最近请假记录查询
  const { data: leaveRecent, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['leaveRecent'],
    queryFn: () => leaveBalanceApi.getLeaveRequests({}),
  });

  // 加载状态
  if ((isAdmin ? isLoadingApprovalStats : isLoadingStats) || isLoadingRecent) {
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

        {isAdmin ? (
          // 管理员视图
          <>
            {/* 审批统计卡片 */}
            <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
              <Text className="text-lg font-bold mb-4">审批统计</Text>
              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold text-yellow-500">
                    {approvalStats?.totalUnApproveLeaves || 0}
                  </Text>
                  <Text className="text-gray-600">待审批</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold text-blue-500">
                    {approvalStats?.totalApprovedLeaves || 0}
                  </Text>
                  <Text className="text-gray-600">总审批量</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold text-green-500">
                    {approvalStats?.totalApprovalLeaves || 0}
                  </Text>
                  <Text className="text-gray-600">已通过</Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold text-red-500">
                    {approvalStats?.totalRejectLeaves || 0}
                  </Text>
                  <Text className="text-gray-600">已驳回</Text>
                </View>
              </View>
            </View>

            {/* 快捷操作卡片 */}
            <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
              <Text className="text-lg font-bold mb-4">快捷操作</Text>
              <View className="flex-row justify-between">
                {/* 审批按钮 */}
                <TouchableOpacity
                  className="w-[30%] aspect-square bg-blue-500 rounded-lg justify-center items-center shadow-sm"
                  onPress={() => router.push('/(tabs)/approval' as any)}
                >
                  <Ionicons name="checkmark-circle-outline" size={28} color="white" style={{ marginBottom: 8 }} />
                  <Text className="text-white font-bold text-sm">审批</Text>
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
          </>
        ) : (
          // 普通用户视图
          <>
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
          </>
        )}

        {/* 最近请假记录 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">最近请假记录</Text>
          {leaveRecent?.items?.map((request) => (
            <LeaveRequestCard key={request.id} item={request} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 