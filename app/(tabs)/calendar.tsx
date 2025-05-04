import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}

// 模拟数据
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    leaveType: '年假',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    days: 2,
    status: 'approved',
  },
  {
    id: '2',
    leaveType: '病假',
    startDate: '2024-03-20',
    endDate: '2024-03-21',
    days: 2,
    status: 'pending',
  },
];

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');

  // 生成日历标记数据
  const getMarkedDates = () => {
    const marked: any = {};
    mockLeaveRequests.forEach(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        marked[dateStr] = {
          marked: true,
          dotColor: request.status === 'approved' ? 'green' : 'yellow',
        };
      }
    });
    return marked;
  };

  // 获取选中日期的请假记录
  const getSelectedDateRequests = () => {
    if (!selectedDate) return [];
    return mockLeaveRequests.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      const selected = new Date(selectedDate);
      return selected >= start && selected <= end;
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 日历视图 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Calendar
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={getMarkedDates()}
            theme={{
              todayTextColor: '#2563eb',
              selectedDayBackgroundColor: '#2563eb',
              selectedDayTextColor: '#ffffff',
            }}
          />
        </View>

        {/* 图例说明 */}
        <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-4">图例说明</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-600">已批准的请假</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
              <Text className="text-gray-600">待审批的请假</Text>
            </View>
          </View>
        </View>

        {/* 选中日期的请假记录 */}
        {selectedDate && (
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold mb-4">
              {new Date(selectedDate).toLocaleDateString()} 的请假记录
            </Text>
            {getSelectedDateRequests().length > 0 ? (
              getSelectedDateRequests().map(request => (
                <TouchableOpacity
                  key={request.id}
                  className="border-b border-gray-100 py-3"
                  onPress={() => router.push(`/leave-request/${request.id}`)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="font-bold">{request.leaveType}</Text>
                    <Text
                      className={`${
                        request.status === 'approved'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {request.status === 'approved' ? '已批准' : '待审批'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-gray-500">当天没有请假记录</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
} 