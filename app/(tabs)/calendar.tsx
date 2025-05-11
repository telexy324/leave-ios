import { LeaveRequestCard } from '@/components/app/LeaveRequestCard';
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RequestStatus } from "@/types/other";
import { formatDate } from "@/utils/date";

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 使用 React Query 获取请假记录
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leaveRequests', currentMonth.getFullYear(), currentMonth.getMonth() + 1],
    queryFn: () => {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);
      
      return leaveBalanceApi.getLeaveRequests({
        page: 1,
        pageSize: 100,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });
    },
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
  });

  // 生成日历标记数据
  const getMarkedDates = () => {
    const marked: any = {};
    leaveRequests?.items?.forEach(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        marked[dateStr] = {
          marked: true,
          dotColor: request.status === RequestStatus.APPROVED ? 'green' : 'yellow',
        };
      }
    });
    return marked;
  };

  // 获取选中日期的请假记录
  const getSelectedDateRequests = () => {
    if (!selectedDate || !leaveRequests?.items) return [];
    const selected = new Date(selectedDate);
    return leaveRequests.items.filter(request => {
      const start = new Date(request.startDate);
      const end = new Date(request.endDate);
      return selected >= start && selected <= end;
    });
  };

  // 处理月份变化
  const handleMonthChange = (month: any) => {
    setCurrentMonth(new Date(month.timestamp));
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <TouchableOpacity
          className="h-12 bg-blue-500 rounded-lg justify-center items-center shadow-sm flex-row"
          onPress={() => {
            // 处理查看日历的逻辑
          }}
        >
          <Ionicons name="calendar-outline" size={24} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-base">查看日历</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-5">
          {/* 日历视图 */}
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              onMonthChange={handleMonthChange}
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
                  <LeaveRequestCard key={request.id} item={request} />
                ))
              ) : (
                <Text className="text-gray-500">当天没有请假记录</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 