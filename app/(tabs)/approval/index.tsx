import { leaveBalanceApi } from "@/lib/leaveBalance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getLeaveTypeText, getStatusColor, getStatusText } from '@/utils/translation';
import { formatDateTime } from '@/utils/date';

export default function ApprovalScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const pageSize = 10;

  // 使用 React Query 获取请假记录
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['leaves', filter],
    queryFn: async ({ pageParam = 1 }) => {
      return await leaveBalanceApi.getLeaveRequests({
        page: pageParam as number,
        pageSize,
        status: filter === 'pending' ? 1 : filter === 'approved' ? 2 : filter === 'rejected' ? 3 : undefined,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta?.currentPage || !lastPage.meta?.totalPages) return undefined;
      if (lastPage.meta.currentPage >= lastPage.meta.totalPages) return undefined;
      return lastPage.meta.currentPage + 1;
    },
  });

  // 如果数据正在加载，可以显示加载状态
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>加载中...</Text>
      </View>
    );
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleFilterChange = (newFilter: typeof filter) => {
    setFilter(newFilter);
  };

  const allRequests = data?.pages.flatMap(page => page.items || []) || [];

  const handleRequestPress = (requestId: number) => {
    router.push({
      pathname: "/(tabs)/approval/[id]",
      params: { id: requestId.toString() }
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 bg-gray-50"
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View className="p-5">
          {/* 筛选器 */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-5">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${
                filter === 'all' ? 'bg-blue-500' : 'bg-white'
              }`}
              onPress={() => handleFilterChange('all')}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'all' ? 'text-white' : 'text-gray-700'
                }`}
              >
                全部
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${
                filter === 'pending' ? 'bg-blue-500' : 'bg-white'
              }`}
              onPress={() => handleFilterChange('pending')}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'pending' ? 'text-white' : 'text-gray-700'
                }`}
              >
                待审批
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${
                filter === 'approved' ? 'bg-blue-500' : 'bg-white'
              }`}
              onPress={() => handleFilterChange('approved')}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'approved' ? 'text-white' : 'text-gray-700'
                }`}
              >
                已通过
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${
                filter === 'rejected' ? 'bg-blue-500' : 'bg-white'
              }`}
              onPress={() => handleFilterChange('rejected')}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'rejected' ? 'text-white' : 'text-gray-700'
                }`}
              >
                已驳回
              </Text>
            </TouchableOpacity>
          </View>

          {/* 请假申请列表 */}
          {allRequests.map(request => (
            <TouchableOpacity
              key={request.id}
              className="bg-white rounded-lg p-5 mb-5 shadow-sm"
              onPress={() => handleRequestPress(request.id)}
            >
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-bold">{getLeaveTypeText(request.type)}</Text>
                <View className={`px-3 py-1 rounded ${getStatusColor(request.status)}`}>
                  <Text className="font-bold">{getStatusText(request.status)}</Text>
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">请假时间</Text>
                  <Text className="font-bold flex-1 text-right" numberOfLines={1}>
                    {formatDateTime(request.startDate)} 至 {formatDateTime(request.endDate)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">请假天数</Text>
                  <Text className="font-bold flex-1 text-right">
                    {request.amount} 天
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600 flex-shrink-0 mr-2">申请时间</Text>
                  <Text className="font-bold flex-1 text-right">
                    {formatDateTime(request.createdAt)}
                  </Text>
                </View>
                {request.reason && (
                  <View>
                    <Text className="text-gray-600 mb-1">请假原因</Text>
                    <Text className="text-base" numberOfLines={2}>{request.reason}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* 加载更多指示器 */}
          {isFetchingNextPage && (
            <View className="py-4">
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 