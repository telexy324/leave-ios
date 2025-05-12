import FileUpload from '@/components/app/FileUpload';
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { LeaveEntity } from '@/types/nestapi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { calculateLeaveDays } from "@/utils/date";
import { format } from "date-fns";

interface Attachment {
  name: string;
  url: string;
}

interface ExtendedLeaveEntity extends LeaveEntity {
  attachments?: Attachment[];
}

export default function EditLeaveRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedLeaveType, setSelectedLeaveType] = useState<number>(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; uri: string }>>([]);

  // 获取请假详情
  const { data: request, isLoading } = useQuery<ExtendedLeaveEntity>({
    queryKey: ['leaveRequest', id],
    queryFn: () => leaveBalanceApi.getLeaveRequest({id: Number(id)}),
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (request) {
      setSelectedLeaveType(request.type);
      setStartDate(new Date(request.startDate));
      setEndDate(new Date(request.endDate));
      setReason(request.reason);
      if (request.attachments) {
        setAttachments(request.attachments.map(att => ({
          name: att.name,
          uri: att.url
        })));
      }
    }
  }, [request]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('提示', '请填写请假原因');
      return;
    }

    try {
      const leaveDays = calculateLeaveDays(startDate, endDate);

      const formattedData = {
        type: selectedLeaveType as 1 | 2 | 3 | 4 | 5,
        startDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(endDate, 'yyyy-MM-dd HH:mm:ss'),
        amount: leaveDays.toString(),
        status: 1 as const,
        reason: reason,
        proof: attachments.length > 0 ? attachments[0].uri : undefined,
      };
      await leaveBalanceApi.updateLeaveRequest(
        {
          id: Number(id),
        },
        formattedData
      );
      
      Alert.alert('成功', '请假申请已更新', [
        {
          text: '确定',
          onPress: () => router.replace('/(tabs)/leave-request'),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '更新失败，请稍后重试');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!request) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">未找到请假记录</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 请假类型选择 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">请假类型</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedLeaveType === 1
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedLeaveType(1)}
            >
              <Text
                className={`text-center font-bold ${
                  selectedLeaveType === 1 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                调休
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedLeaveType === 2
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedLeaveType(2)}
            >
              <Text
                className={`text-center font-bold ${
                  selectedLeaveType === 2 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                年假
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedLeaveType === 3
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedLeaveType(3)}
            >
              <Text
                className={`text-center font-bold ${
                  selectedLeaveType === 3 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                病假
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row space-x-3 mt-3">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedLeaveType === 4
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedLeaveType(4)}
            >
              <Text
                className={`text-center font-bold ${
                  selectedLeaveType === 4 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                事假
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                selectedLeaveType === 5
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedLeaveType(5)}
            >
              <Text
                className={`text-center font-bold ${
                  selectedLeaveType === 5 ? 'text-primary' : 'text-gray-600'
                }`}
              >
                其他
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 请假时间选择 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">请假时间</Text>
          <View className="space-y-3">
            <View>
              <Text className="text-gray-600 mb-1">开始时间</Text>
              <DateTimePicker
                value={startDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => date && setStartDate(date)}
              />
            </View>
            <View>
              <Text className="text-gray-600 mb-1">结束时间</Text>
              <DateTimePicker
                value={endDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => date && setEndDate(date)}
              />
            </View>
          </View>
        </View>

        {/* 请假原因 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">请假原因</Text>
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 min-h-[120px]"
            multiline
            placeholder="请输入请假原因..."
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* 附件上传 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">附件上传</Text>
          <FileUpload
            files={attachments}
            onFilesChange={setAttachments}
            maxFiles={3}
            allowedTypes={['image/*', 'application/pdf']}
          />
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          className="h-12 bg-blue-500 rounded-lg justify-center items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-base">保存修改</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 