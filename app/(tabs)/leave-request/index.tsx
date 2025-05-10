import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { LeaveStatus } from '../../../types/leave-request';

export default function LeaveRequestScreen() {
  const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 获取请假记录列表
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leaveRequests', selectedStatus, page],
    queryFn: () => leaveBalanceApi.getLeaveRequests({
      page,
      pageSize,
      status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    }),
  });

  // 状态选项
  const statusOptions: { value: LeaveStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: '全部' },
    { value: 'PENDING', label: '待审批' },
    { value: 'APPROVED', label: '已批准' },
    { value: 'REJECTED', label: '已拒绝' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* 顶部操作栏 */}
      <View className="bg-white p-4 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-lg font-bold">我的请假</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => router.push('/(tabs)/leave-request/new' as any)}
        >
          <Ionicons name="add" size={20} color="white" style={{ marginRight: 4 }} />
          <Text className="text-white font-bold">申请请假</Text>
        </TouchableOpacity>
      </View>

      {/* 状态筛选 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row p-2">
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedStatus === option.value ? 'bg-blue-500' : 'bg-gray-100'
              }`}
              onPress={() => setSelectedStatus(option.value)}
            >
              <Text
                className={`font-medium ${
                  selectedStatus === option.value ? 'text-white' : 'text-gray-600'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 请假记录列表 */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : leaveRequests?.items?.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">暂无请假记录</Text>
          </View>
        ) : (
          leaveRequests?.items?.map((request) => (
            <TouchableOpacity
              key={request.id}
              className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              onPress={() => router.push(`/leave-request/${request.id}`)}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-lg font-bold mb-1">
                    {request.type === 'ANNUAL' ? '年假' :
                     request.type === 'SICK' ? '病假' :
                     request.type === 'PERSONAL' ? '事假' :
                     request.type === 'COMPENSATORY' ? '调休' : '其他'}
                  </Text>
                  <Text className="text-gray-600">
                    {new Date(request.startDate).toLocaleDateString()} 至{' '}
                    {new Date(request.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  request.status === 'PENDING' ? 'bg-yellow-500' :
                  request.status === 'APPROVED' ? 'bg-green-500' :
                  request.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  <Text className="text-white text-sm">
                    {request.status === 'PENDING' ? '待审批' :
                     request.status === 'APPROVED' ? '已批准' :
                     request.status === 'REJECTED' ? '已拒绝' : '未知'}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600" numberOfLines={2}>
                {request.reason}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
} 