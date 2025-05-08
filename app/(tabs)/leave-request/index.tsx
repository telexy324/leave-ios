import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  documents?: string[];
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
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
    leaveType: '病假',
    startDate: '2024-03-20',
    endDate: '2024-03-21',
    days: 2,
    reason: '感冒发烧',
    status: 'approved',
    createdAt: '2024-03-18 09:00',
    documents: ['医院证明.pdf'],
  },
];

export default function LeaveRequestScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = mockLeaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
    }
  };

  const getStatusText = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已批准';
      case 'rejected':
        return '已拒绝';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <TouchableOpacity
          className="h-12 bg-blue-500 rounded-lg justify-center items-center shadow-sm flex-row"
          onPress={() => router.push('/(tabs)/leave-request/new' as any)}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">申请请假</Text>
        </TouchableOpacity>
      </View>
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
            <TouchableOpacity
              key={request.id}
              className="bg-white rounded-lg p-5 mb-5 shadow-sm"
              onPress={() => router.push(`/leave-request/${request.id}`)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-bold">{request.leaveType}</Text>
                <View className={`px-3 py-1 rounded ${getStatusColor(request.status)}`}>
                  <Text className="font-bold">{getStatusText(request.status)}</Text>
                </View>
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
                <View>
                  <Text className="text-gray-600 mb-1">请假原因</Text>
                  <Text className="text-base">{request.reason}</Text>
                </View>
                {request.documents && request.documents.length > 0 && (
                  <View>
                    <Text className="text-gray-600 mb-1">附件</Text>
                    <View className="flex-row flex-wrap">
                      {request.documents.map((doc, index) => (
                        <View
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
                        >
                          <Text className="text-gray-600">{doc}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 