import { leaveBalanceApi } from '@/lib/leaveBalance';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LeaveRequestCard } from "@/components/app/LeaveRequestCard";
import { RequestStatus } from '@/types/other';

export default function LeaveRequestDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 使用 React Query 获取请假详情
  const { data: request, isLoading } = useQuery({
    queryKey: ['leaveRequest', id],
    queryFn: () => leaveBalanceApi.getLeaveRequest({id: Number(id)}),
    staleTime: 30000, // 30秒内不重新请求
    retry: 2,
    retryDelay: 1000,
  });

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
          onPress: async () => {
            try {
              await leaveBalanceApi.cancelLeaveRequest({id: Number(id)});
              router.back();
            } catch (error) {
              Alert.alert('错误', '撤回申请失败，请稍后重试');
            }
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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!request) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">未找到请假记录</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 状态卡片 */}
        <LeaveRequestCard item={request} />

        {/* 审批信息 */}
        {(request.status === RequestStatus.APPROVED || request.status === RequestStatus.REJECTED) && (
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold mb-3">审批信息</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">审批人</Text>
                <Text className="font-bold">{request.approver?.username}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">审批时间</Text>
                <Text className="font-bold">
                  {new Date(request.doneAt).toLocaleString()}
                </Text>
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
        {request.status === RequestStatus.PENDING && (
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