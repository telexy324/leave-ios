import { LeaveRequestCard } from '@/components/app/LeaveRequestCard';
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { LeaveEntity } from '@/types/nestapi';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function LeaveRequestScreen() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const pageSize = 10;

  // 使用 leaveBalanceApi 的 getLeaveRequests 接口
  const { 
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['leaveRequests', filter],
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

  // 状态选项
  const statusOptions: { value: string | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待审批' },
    { value: 'approved', label: '已批准' },
    { value: 'rejected', label: '已拒绝' },
  ];

  const handleFilterChange = (newFilter: typeof filter) => {
    if (newFilter === filter) return;
    setFilter(newFilter);
  };

  // 处理加载更多
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  // 渲染空状态
  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-8">
      <Text className="text-gray-500">暂无请假记录</Text>
    </View>
  );

  // 渲染列表项
  const renderItem = ({ item }: { item: LeaveEntity }) => (
    <LeaveRequestCard item={item} />
  );

  const allRequests = data?.pages.flatMap(page => page.items || []) || [];

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
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row p-3 justify-between">
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 mx-1 py-2 rounded-lg ${
                filter === option.value 
                  ? 'bg-blue-500' 
                  : 'bg-gray-50'
              }`}
              onPress={() => handleFilterChange(option.value as typeof filter)}
            >
              <Text
                className={`text-center font-medium ${
                  filter === option.value 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 请假记录列表 */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={allRequests}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
} 