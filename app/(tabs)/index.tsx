import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLeave } from '@/context/LeaveContext';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { leaveStats } = useLeave();
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 用户信息卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-xl font-bold mb-2">你好，{user?.username}</Text>
          <Text className="text-gray-600">员工编号：{user?.employeeId}</Text>
          <Text className="text-gray-600">部门：{user?.department}</Text>
        </View>

        {/* 假期统计卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">假期统计</Text>
          <View className="flex-row justify-between">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{leaveStats?.annual}</Text>
              <Text className="text-gray-600">年假剩余</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{leaveStats?.sick}</Text>
              <Text className="text-gray-600">病假剩余</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary">{leaveStats?.personal}</Text>
              <Text className="text-gray-600">事假剩余</Text>
            </View>
          </View>
        </View>

        {/* 快捷操作卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">快捷操作</Text>
          <View className="flex-row flex-wrap">
            <TouchableOpacity
              className="w-1/2 p-2.5"
              onPress={() => router.push('/leave-request/new')}
            >
              <View className="bg-primary/10 rounded-lg p-4 items-center">
                <Text className="text-primary font-bold mb-1">申请请假</Text>
                <Text className="text-xs text-gray-600">发起新的请假申请</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 p-2.5"
              onPress={() => router.push('/calendar')}
            >
              <View className="bg-success/10 rounded-lg p-4 items-center">
                <Text className="text-success font-bold mb-1">查看日历</Text>
                <Text className="text-xs text-gray-600">查看请假记录</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 p-2.5"
              onPress={() => router.push('/profile')}
            >
              <View className="bg-warning/10 rounded-lg p-4 items-center">
                <Text className="text-warning font-bold mb-1">个人信息</Text>
                <Text className="text-xs text-gray-600">查看和修改个人信息</Text>
              </View>
            </TouchableOpacity>
            {user?.role === 'admin' && (
              <TouchableOpacity
                className="w-1/2 p-2.5"
                onPress={() => router.push('/admin')}
              >
                <View className="bg-danger/10 rounded-lg p-4 items-center">
                  <Text className="text-danger font-bold mb-1">管理后台</Text>
                  <Text className="text-xs text-gray-600">管理用户和审批</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 最近请假记录卡片 */}
        <View className="bg-white rounded-lg p-5 shadow-sm">
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