import { leaveBalanceApi } from '@/lib/leaveBalance';
import { useAuthStore } from '@/lib/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // 使用 React Query 获取假期统计
  const { data: leaveStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
  });

  useEffect(() => {
    // 检查用户是否已登录
    if (!user) {
      // 如果未登录，重定向到登录页面
      router.replace('/(auth)/login');
    }
  }, [user]);

  // 如果用户未登录，不渲染任何内容
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    Alert.alert(
      '确认登出',
      '确定要退出登录吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('错误', '登出失败，请重试');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 个人信息卡片 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-gray-200 rounded-full mb-3" />
            <Text className="text-xl font-bold">{user?.username || '用户名'}</Text>
            <Text className="text-gray-500">{user?.email || 'user@example.com'}</Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">部门</Text>
              <Text className="font-bold">{user?.department || '未设置'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">职位</Text>
              <Text className="font-bold">{user?.position || '未设置'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">入职日期</Text>
              <Text className="font-bold">{user?.joinDate || '未设置'}</Text>
            </View>
          </View>
        </View>

        {/* 假期余额 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">假期余额</Text>
          {isStatsLoading ? (
            <View className="items-center py-4">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : (
            <View className="space-y-4">
              {/* 年假 */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">年假</Text>
                  <Text className="text-gray-600">
                    剩余 {leaveStats?.totalAnnualLeaves - leaveStats?.usedAnnualLeaves} 天
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((leaveStats?.usedAnnualLeaves || 0) / (leaveStats?.totalAnnualLeaves || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">已使用 {leaveStats?.usedAnnualLeaves || 0} 天</Text>
                  <Text className="text-gray-500">总计 {leaveStats?.totalAnnualLeaves || 0} 天</Text>
                </View>
              </View>

              {/* 病假 */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">病假</Text>
                  <Text className="text-gray-600">
                    剩余 {leaveStats?.totalSickLeaves - leaveStats?.usedSickLeaves} 天
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((leaveStats?.usedSickLeaves || 0) / (leaveStats?.totalSickLeaves || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">已使用 {leaveStats?.usedSickLeaves || 0} 天</Text>
                  <Text className="text-gray-500">总计 {leaveStats?.totalSickLeaves || 0} 天</Text>
                </View>
              </View>

              {/* 调休 */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">调休</Text>
                  <Text className="text-gray-600">
                    剩余 {leaveStats?.totalCompensatoryLeaves - leaveStats?.usedCompensatoryLeaves} 天
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((leaveStats?.usedCompensatoryLeaves || 0) / (leaveStats?.totalCompensatoryLeaves || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">已使用 {leaveStats?.usedCompensatoryLeaves || 0} 天</Text>
                  <Text className="text-gray-500">总计 {leaveStats?.totalCompensatoryLeaves || 0} 天</Text>
                </View>
              </View>

              {/* 事假 */}
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">事假</Text>
                  <Text className="text-gray-600">
                    剩余 {leaveStats?.totalPersonalLeaves - leaveStats?.usedPersonalLeaves} 天
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        ((leaveStats?.usedPersonalLeaves || 0) / (leaveStats?.totalPersonalLeaves || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">已使用 {leaveStats?.usedPersonalLeaves || 0} 天</Text>
                  <Text className="text-gray-500">总计 {leaveStats?.totalPersonalLeaves || 0} 天</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 操作按钮 */}
        <View className="p-4 space-y-3">
          <TouchableOpacity
            className="h-12 bg-white rounded-lg justify-center items-center shadow-sm flex-row"
            onPress={() => router.push('/(tabs)/profile/edit' as any)}
          >
            <Ionicons name="create-outline" size={24} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-gray-800 font-bold text-base">编辑个人信息</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="h-12 bg-white rounded-lg justify-center items-center shadow-sm flex-row"
            onPress={() => router.push('/(tabs)/profile/change-password' as any)}
          >
            <Ionicons name="key-outline" size={24} color="#3b82f6" style={{ marginRight: 8 }} />
            <Text className="text-gray-800 font-bold text-base">修改密码</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="h-12 bg-red-500 rounded-lg justify-center items-center shadow-sm flex-row"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-base">退出登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 