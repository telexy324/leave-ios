import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

// 模拟数据
const mockLeaveBalances: LeaveBalance[] = [
  {
    type: '年假',
    total: 15,
    used: 5,
    remaining: 10,
  },
  {
    type: '病假',
    total: 30,
    used: 2,
    remaining: 28,
  },
  {
    type: '事假',
    total: 10,
    used: 1,
    remaining: 9,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

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
              <Text className="font-bold">技术部</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">职位</Text>
              <Text className="font-bold">高级工程师</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">入职日期</Text>
              <Text className="font-bold">2023-01-01</Text>
            </View>
          </View>
        </View>

        {/* 假期余额 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">假期余额</Text>
          <View className="space-y-4">
            {mockLeaveBalances.map(balance => (
              <View key={balance.type} className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">{balance.type}</Text>
                  <Text className="text-gray-600">
                    剩余 {balance.remaining} 天
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${(balance.used / balance.total) * 100}%`,
                    }}
                  />
                </View>
                <View className="flex-row justify-between text-sm">
                  <Text className="text-gray-500">已使用 {balance.used} 天</Text>
                  <Text className="text-gray-500">总计 {balance.total} 天</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 操作按钮 */}
        <View className="space-y-3">
          <TouchableOpacity
            className="h-12 bg-white rounded-lg justify-center items-center shadow-sm"
            onPress={() => router.push('/profile/edit')}
          >
            <Text className="text-gray-800 font-bold text-base">编辑个人信息</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-12 bg-white rounded-lg justify-center items-center shadow-sm"
            onPress={() => router.push('/profile/change-password')}
          >
            <Text className="text-gray-800 font-bold text-base">修改密码</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 