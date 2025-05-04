import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ApprovalModal from '../../components/ApprovalModal';

interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// 模拟数据
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '1',
    userName: '张三',
    department: '技术部',
    leaveType: '年假',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    days: 2,
    reason: '个人事务',
    status: 'pending',
    createdAt: '2024-03-10 10:00',
  },
  {
    id: '2',
    userId: '2',
    userName: '李四',
    department: '市场部',
    leaveType: '病假',
    startDate: '2024-03-20',
    endDate: '2024-03-21',
    days: 2,
    reason: '感冒发烧',
    status: 'pending',
    createdAt: '2024-03-18 09:00',
  },
];

export default function ApprovalScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

  const filteredRequests = mockLeaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const handleApprove = (id: string) => {
    setSelectedRequestId(id);
    setModalType('approve');
    setModalVisible(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setModalType('reject');
    setModalVisible(true);
  };

  const handleModalSubmit = (comment: string) => {
    // TODO: 实现审批逻辑，发送到后端
    console.log('Submit:', {
      requestId: selectedRequestId,
      type: modalType,
      comment,
    });
    setModalVisible(false);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 筛选器 */}
        <View className="flex-row bg-white rounded-lg p-1 mb-5 shadow-sm">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              filter === 'all' ? 'bg-primary' : 'bg-transparent'
            }`}
            onPress={() => setFilter('all')}
          >
            <Text
              className={`text-center font-bold ${
                filter === 'all' ? 'text-white' : 'text-gray-600'
              }`}
            >
              全部
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              filter === 'pending' ? 'bg-primary' : 'bg-transparent'
            }`}
            onPress={() => setFilter('pending')}
          >
            <Text
              className={`text-center font-bold ${
                filter === 'pending' ? 'text-white' : 'text-gray-600'
              }`}
            >
              待审批
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              filter === 'approved' ? 'bg-primary' : 'bg-transparent'
            }`}
            onPress={() => setFilter('approved')}
          >
            <Text
              className={`text-center font-bold ${
                filter === 'approved' ? 'text-white' : 'text-gray-600'
              }`}
            >
              已批准
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${
              filter === 'rejected' ? 'bg-primary' : 'bg-transparent'
            }`}
            onPress={() => setFilter('rejected')}
          >
            <Text
              className={`text-center font-bold ${
                filter === 'rejected' ? 'text-white' : 'text-gray-600'
              }`}
            >
              已拒绝
            </Text>
          </TouchableOpacity>
        </View>

        {/* 请假申请列表 */}
        {filteredRequests.map(request => (
          <View
            key={request.id}
            className="bg-white rounded-lg p-5 mb-5 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-lg font-bold">{request.userName}</Text>
                <Text className="text-gray-500">{request.department}</Text>
              </View>
              <Text className="text-gray-500">{request.createdAt}</Text>
            </View>

            <View className="space-y-2 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">请假类型</Text>
                <Text className="font-bold">{request.leaveType}</Text>
              </View>
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
              <View>
                <Text className="text-gray-600 mb-1">请假原因</Text>
                <Text className="text-base">{request.reason}</Text>
              </View>
            </View>

            {request.status === 'pending' && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 h-12 bg-red-500 rounded-lg justify-center items-center"
                  onPress={() => handleReject(request.id)}
                >
                  <Text className="text-white font-bold text-base">拒绝</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-12 bg-primary rounded-lg justify-center items-center"
                  onPress={() => handleApprove(request.id)}
                >
                  <Text className="text-white font-bold text-base">批准</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* 审批意见弹窗 */}
        <ApprovalModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleModalSubmit}
          type={modalType}
        />
      </View>
    </ScrollView>
  );
} 