import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  attachments?: Array<{ name: string; uri: string }>;
  createdAt: string;
  approver?: string;
  approvedAt?: string;
  comment?: string;
}

// 模拟数据
const mockLeaveRequest: LeaveRequest = {
  id: '1',
  leaveType: '年假',
  startDate: '2024-03-15',
  endDate: '2024-03-16',
  days: 2,
  reason: '个人事务',
  status: 'pending',
  attachments: [
    { name: '请假证明.pdf', uri: 'file:///path/to/file.pdf' },
  ],
  createdAt: '2024-03-10 10:00',
};

export default function LeaveRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [request, setRequest] = useState<LeaveRequest>(mockLeaveRequest);

  const handleRevoke = () => {
    Alert.alert(
      '撤回申请',
      '确定要撤回该请假申请吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: () => {
            // TODO: 实现撤回逻辑，发送到后端
            console.log('Revoke request:', id);
            router.back();
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/leave-request/edit/[id]',
      params: { id },
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 状态卡片 */}
        <View
          className={`bg-white rounded-lg p-5 mb-5 shadow-sm border-l-4 ${
            request.status === 'approved'
              ? 'border-green-500'
              : request.status === 'rejected'
              ? 'border-red-500'
              : 'border-yellow-500'
          }`}
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">{request.leaveType}</Text>
            <Text
              className={`font-bold ${
                request.status === 'approved'
                  ? 'text-green-500'
                  : request.status === 'rejected'
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }`}
            >
              {request.status === 'approved'
                ? '已批准'
                : request.status === 'rejected'
                ? '已拒绝'
                : '待审批'}
            </Text>
          </View>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">请假时间</Text>
              <Text className="font-bold">
                {request.startDate} 至 {request.endDate}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">请假天数</Text>
              <Text className="font-bold">{request.days} 天</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">申请时间</Text>
              <Text className="font-bold">{request.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* 请假原因 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-3">请假原因</Text>
          <Text className="text-base">{request.reason}</Text>
        </View>

        {/* 审批信息 */}
        {request.status !== 'pending' && (
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold mb-3">审批信息</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">审批人</Text>
                <Text className="font-bold">{request.approver}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">审批时间</Text>
                <Text className="font-bold">{request.approvedAt}</Text>
              </View>
              {request.comment && (
                <View>
                  <Text className="text-gray-600 mb-1">审批意见</Text>
                  <Text className="text-base">{request.comment}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* 附件列表 */}
        {request.attachments && request.attachments.length > 0 && (
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold mb-3">附件</Text>
            <View className="space-y-2">
              {request.attachments.map((file, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center bg-gray-50 p-3 rounded-lg"
                >
                  <Text className="flex-1 text-gray-800">{file.name}</Text>
                  <Text className="text-primary">查看</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 操作按钮 */}
        {request.status === 'pending' && (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 h-12 bg-gray-200 rounded-lg justify-center items-center"
              onPress={handleRevoke}
            >
              <Text className="text-gray-800 font-bold text-base">撤回申请</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 h-12 bg-primary rounded-lg justify-center items-center"
              onPress={handleEdit}
            >
              <Text className="text-white font-bold text-base">修改申请</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 