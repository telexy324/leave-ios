import { LeaveEntity } from '@/types/nestapi';
import { getLeaveTypeText, getStatusColor, getStatusText } from "@/utils/translation";
import { formatDateTime } from "@/utils/date";
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface LeaveRequestCardProps {
  item: LeaveEntity;
}

export function LeaveRequestCard({ item }: LeaveRequestCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-4 shadow-sm"
      onPress={() => router.push(`/leave-request/${item.id}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-lg font-bold mb-1">
            {getLeaveTypeText(item.type)}
          </Text>
          <Text className="text-gray-600">
            {new Date(item.startDate).toLocaleDateString()} 至{' '}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          getStatusColor(item.status)
        }`}>
          <Text className={`text-sm ${
            getStatusColor(item.status)
          }`}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-gray-600 flex-shrink-0 mr-2">请假时间</Text>
          <Text className="font-bold flex-1 text-right" numberOfLines={1}>
            {formatDateTime(item.startDate)} 至 {formatDateTime(item.endDate)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600 flex-shrink-0 mr-2">请假天数</Text>
          <Text className="font-bold flex-1 text-right">
            {item.amount} 天
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600 flex-shrink-0 mr-2">申请时间</Text>
          <Text className="font-bold flex-1 text-right">
            {formatDateTime(item.createdAt)}
          </Text>
        </View>
        {item.reason && (
          <View>
            <Text className="text-gray-600 mb-1">请假原因</Text>
            <Text className="text-base" numberOfLines={2}>{item.reason}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
} 