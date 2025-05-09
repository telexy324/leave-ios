import { leaveBalanceApi } from "@/lib/leaveBalance";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ApprovalModal from '../../components/ApprovalModal';

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

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return 'bg-yellow-100 text-yellow-600';
    case 2:
      return 'bg-green-100 text-green-600';
    case 3:
      return 'bg-red-100 text-red-600';
    case 4:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-yellow-100 text-yellow-600';
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 1:
      return '待审批';
    case 2:
      return '已通过';
    case 3:
      return '已驳回';
    case 4:
      return '已取消';
    default:
      return '待审批';
  }
};

const getLeaveTypeText = (type: number) => {
  switch (type) {
    case 1:
      return '调休';
    case 2:
      return '年假';
    case 3:
      return '病假';
    case 4:
      return '事假';
    case 5:
      return '其他';
    default:
      return '其他';
  }
};

export default function ApprovalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');

  // 获取请假申请详情
  const { data: leaveRequest, isLoading } = useQuery({
    queryKey: ['leave', id],
    queryFn: () => leaveBalanceApi.getLeaveRequest({ id: Number(id) }),
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!leaveRequest) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">未找到请假申请</Text>
      </View>
    );
  }

  const handleApprove = () => {
    setModalType('approve');
    setModalVisible(true);
  };

  const handleReject = () => {
    setModalType('reject');
    setModalVisible(true);
  };

  const handleModalSubmit = async (comment: string) => {
    try {
      if (modalType === 'approve') {
        await leaveBalanceApi.approveLeaveRequest({ id: Number(id) }, { comment });
      } else {
        await leaveBalanceApi.rejectLeaveRequest({ id: Number(id) }, { comment });
      }
      router.back();
    } catch (error) {
      console.error('审批操作失败:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-5">
          {/* 状态卡片 */}
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">{getLeaveTypeText(leaveRequest.type)}</Text>
              <View className={`px-3 py-1 rounded ${getStatusColor(leaveRequest.status)}`}>
                <Text className="font-bold">{getStatusText(leaveRequest.status)}</Text>
              </View>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-600 mb-1">请假时间</Text>
                <Text className="text-base">
                  {formatDateTime(leaveRequest.startDate)} 至 {formatDateTime(leaveRequest.endDate)}
                </Text>
              </View>

              <View>
                <Text className="text-gray-600 mb-1">请假天数</Text>
                <Text className="text-base">{leaveRequest.amount} 天</Text>
              </View>

              <View>
                <Text className="text-gray-600 mb-1">申请时间</Text>
                <Text className="text-base">{formatDateTime(leaveRequest.createdAt)}</Text>
              </View>

              {leaveRequest.reason && (
                <View>
                  <Text className="text-gray-600 mb-1">请假原因</Text>
                  <Text className="text-base">{leaveRequest.reason}</Text>
                </View>
              )}
            </View>
          </View>

          {/* 审批操作按钮 */}
          {leaveRequest.status === 1 && (
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="w-[48%] bg-green-500 py-3 rounded-lg"
                onPress={handleApprove}
              >
                <Text className="text-white text-center font-bold">通过</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[48%] bg-red-500 py-3 rounded-lg"
                onPress={handleReject}
              >
                <Text className="text-white text-center font-bold">驳回</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 审批意见弹窗 */}
      <ApprovalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        type={modalType}
      />
    </View>
  );
} 