import { LeaveRequestCard } from '@/components/app/LeaveRequestCard';
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { RequestStatus } from "@/types/other";
import { formatDate } from "@/utils/date";
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Svg, { Path } from 'react-native-svg';

// 自定义日期组件
const CustomDay = ({ date, state, marking, onPress }: any) => {
  const getStatusColors = () => {
    const colors = {
      pending: false,
      approved: false,
      rejected: false
    };

    marking?.dots?.forEach((dot: any) => {
      if (dot.color === '#eab308') colors.pending = true;
      if (dot.color === '#22c55e') colors.approved = true;
      if (dot.color === '#ef4444') colors.rejected = true;
    });

    return colors;
  };

  const renderCircle = () => {
    const colors = getStatusColors();
    const activeColors = Object.values(colors).filter(Boolean).length;
    if (activeColors === 0) return null;

    const size = 36;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const segments = [];
    let startAngle = -90; // 从顶部开始

    if (colors.pending) {
      const arcLength = circumference / activeColors;
      segments.push(
        <Path
          key="pending"
          d={`M ${center + radius * Math.cos(startAngle * Math.PI / 180)} ${center + radius * Math.sin(startAngle * Math.PI / 180)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos((startAngle + 360 / activeColors) * Math.PI / 180)} ${center + radius * Math.sin((startAngle + 360 / activeColors) * Math.PI / 180)}`}
          stroke="#eab308"
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
      startAngle += 360 / activeColors;
    }

    if (colors.approved) {
      const arcLength = circumference / activeColors;
      segments.push(
        <Path
          key="approved"
          d={`M ${center + radius * Math.cos(startAngle * Math.PI / 180)} ${center + radius * Math.sin(startAngle * Math.PI / 180)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos((startAngle + 360 / activeColors) * Math.PI / 180)} ${center + radius * Math.sin((startAngle + 360 / activeColors) * Math.PI / 180)}`}
          stroke="#22c55e"
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
      startAngle += 360 / activeColors;
    }

    if (colors.rejected) {
      const arcLength = circumference / activeColors;
      segments.push(
        <Path
          key="rejected"
          d={`M ${center + radius * Math.cos(startAngle * Math.PI / 180)} ${center + radius * Math.sin(startAngle * Math.PI / 180)} A ${radius} ${radius} 0 0 1 ${center + radius * Math.cos((startAngle + 360 / activeColors) * Math.PI / 180)} ${center + radius * Math.sin((startAngle + 360 / activeColors) * Math.PI / 180)}`}
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
    }

    return (
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {segments}
      </Svg>
    );
  };

  return (
    <TouchableOpacity 
      style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}
      onPress={() => onPress(date)}
    >
      {renderCircle()}
      <Text
        style={{
          textAlign: 'center',
          color: state === 'disabled' ? '#d9e1e8' : '#2d4150',
          fontSize: 16,
        }}
      >
        {date.day}
      </Text>
    </TouchableOpacity>
  );
};

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

  // 获取选中日期的请假记录
  const { data: selectedDateRequests, isLoading: isLoadingSelectedDate } = useQuery({
    queryKey: ['selectedDateRequests', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return { items: [] };
      const date = new Date(selectedDate);
      // 设置时间为当天的开始和结束
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      console.log('Fetching leave requests for date:', {
        selectedDate,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
      });

      const response = await leaveBalanceApi.getLeaveRequests({
        page: 1,
        pageSize: 100,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      console.log('Leave requests response:', response);
      return response;
    },
    enabled: !!selectedDate,
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
        // 根据状态设置不同的颜色
        let color = '';
        switch (request.status) {
          case RequestStatus.PENDING:
            color = '#eab308'; // yellow-500
            break;
          case RequestStatus.APPROVED:
            color = '#22c55e'; // green-500
            break;
          case RequestStatus.REJECTED:
            color = '#ef4444'; // red-500
            break;
        }

        if (!marked[dateStr]) {
          marked[dateStr] = {
            dots: [],
            selected: true,
            selectedColor: 'transparent',
            selectedTextColor: '#000000',
          };
        }

        marked[dateStr].dots.push({
          color: color,
          key: request.id.toString(),
        });
      }
    });
    return marked;
  };

  // 处理月份变化
  const handleMonthChange = (month: any) => {
    setCurrentMonth(new Date(month.timestamp));
  };

  // 处理日期选择
  const handleDayPress = (day: any) => {
    console.log('Day pressed:', day);
    setSelectedDate(day.dateString);
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
              onDayPress={handleDayPress}
              onMonthChange={handleMonthChange}
              markedDates={getMarkedDates()}
              markingType="multi-dot"
              dayComponent={(props) => <CustomDay {...props} onPress={handleDayPress} />}
              theme={{
                todayTextColor: '#2563eb',
                selectedDayBackgroundColor: '#2563eb',
                selectedDayTextColor: '#ffffff',
                dotColor: '#2563eb',
                selectedDotColor: '#ffffff',
                arrowColor: '#2563eb',
                monthTextColor: '#1f2937',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
              }}
            />
          </View>

          {/* 图例说明 */}
          <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
            <Text className="text-lg font-bold mb-4">图例说明</Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full border-2 border-green-500 mr-2" />
                <Text className="text-gray-600">已批准的请假</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full border-2 border-yellow-500 mr-2" />
                <Text className="text-gray-600">待审批的请假</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-full border-2 border-red-500 mr-2" />
                <Text className="text-gray-600">已拒绝的请假</Text>
              </View>
            </View>
          </View>

          {/* 选中日期的请假记录 */}
          {selectedDate && (
            <View className="bg-white rounded-lg p-5 mb-5 shadow-sm">
              <Text className="text-lg font-bold mb-4">
                {new Date(selectedDate).toLocaleDateString()} 的请假记录
              </Text>
              {isLoadingSelectedDate ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#3b82f6" />
                </View>
              ) : (selectedDateRequests?.items?.length ?? 0) > 0 ? (
                selectedDateRequests?.items?.map(request => (
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