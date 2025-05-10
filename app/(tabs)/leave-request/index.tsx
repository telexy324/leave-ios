import { leaveBalanceApi } from '@/lib/leaveBalance';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LeaveRequestScreen() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 10;

  // 使用 leaveBalanceApi 的 getLeaveRequests 接口
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leaveRequests', filter, page],
    queryFn: async () => {
      const data = await leaveBalanceApi.getLeaveRequests({
        page,
        pageSize,
        status: filter === 'pending' ? 1 : filter === 'approved' ? 2 : filter === 'rejected' ? 3 : undefined,
      })
      const currentTotalPage = Math.ceil((data?.meta?.totalPages || 0) / pageSize);
      if ((data?.meta?.currentPage || 0) > currentTotalPage) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      return data
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
    setFilter(newFilter);
  };

  // 处理加载更多
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (!hasMore) return null;
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
  const renderItem = ({ item: request }) => (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => router.push(`/leave-request/${request.id}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-lg font-bold mb-1">
            {request.type === 'ANNUAL' ? '年假' :
             request.type === 'SICK' ? '病假' :
             request.type === 'PERSONAL' ? '事假' :
             request.type === 'COMPENSATORY' ? '调休' : '其他'}
          </Text>
          <Text className="text-gray-600">
            {new Date(request.startDate).toLocaleDateString()} 至{' '}
            {new Date(request.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          request.status === 'PENDING' ? 'bg-yellow-500' :
          request.status === 'APPROVED' ? 'bg-green-500' :
          request.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          <Text className="text-white text-sm">
            {request.status === 'PENDING' ? '待审批' :
             request.status === 'APPROVED' ? '已批准' :
             request.status === 'REJECTED' ? '已拒绝' : '未知'}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600" numberOfLines={2}>
        {request.reason}
      </Text>
    </TouchableOpacity>
  );

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row p-2">
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`px-4 py-2 rounded-full mr-2 ${
                filter === option.value ? 'bg-blue-500' : 'bg-gray-100'
              }`}
              onPress={() => handleFilterChange('approved')}
            >
              <Text
                className={`font-medium ${
                  filter === option.value ? 'text-white' : 'text-gray-600'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 请假记录列表 */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={leaveRequests?.items || []}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
} 