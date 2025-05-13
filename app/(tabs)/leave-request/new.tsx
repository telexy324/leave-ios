import FileUpload from "@/components/app/FileUpload";
import { leaveBalanceApi } from '@/lib/leaveBalance';
import { uploadApi } from "@/lib/upload";
import { LeaveEntity } from '@/types/nestapi';
import { calculateLeaveDays } from "@/utils/date";
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

interface Attachment {
  name: string;
  url: string;
}

interface ExtendedLeaveEntity extends LeaveEntity {
  attachments?: Attachment[];
}

// 定义表单验证 schema
const schema = z.object({
  leaveType: z.number().min(1, '请选择请假类型'),
  startDate: z.date({
    required_error: '请选择开始时间',
  }),
  endDate: z.date({
    required_error: '请选择结束时间',
  }),
  reason: z.string().min(8, '请假原因至少8个字符'),
  proof: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface LeaveType {
  id: number;
  name: string;
  remainingDays: number;
}

export default function LeaveRequestFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEdit = !!id;
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Array<{ name: string; uri: string; type: string; size: number }>>([]);

  // 使用 React Query 获取假期统计
  const { data: leaveStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
  });

  // 如果是编辑模式，获取请假详情
  const { data: request, isLoading: isLoadingRequest } = useQuery<ExtendedLeaveEntity>({
    queryKey: ['leaveRequest', id],
    queryFn: () => leaveBalanceApi.getLeaveRequest({id: Number(id)}),
    enabled: isEdit,
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
  });

  // 初始化表单
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      leaveType: undefined,
      startDate: undefined,
      endDate: undefined,
      reason: '',
      proof: undefined,
    },
  });

  // 如果是编辑模式，设置表单初始值
  useEffect(() => {
    if (request) {
      reset({
        leaveType: request.type,
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        reason: request.reason,
        proof: request.proof?.[0],
      });
      if (request.proof && request.proof.length > 0) {
        setFiles(request.proof.map(url => ({
          name: url.split('/').pop() || '文件',
          uri: url,
          type: 'application/octet-stream',
          size: 0
        })));
      }
    }
  }, [request, reset]);

  // 将后端数据转换为前端需要的格式
  const leaveTypes: LeaveType[] = [
    {
      id: 2, // 年假
      name: '年假',
      remainingDays: (leaveStats?.totalAnnualLeaves || 0) - (leaveStats?.usedAnnualLeaves || 0),
    },
    {
      id: 3, // 病假
      name: '病假',
      remainingDays: (leaveStats?.totalSickLeaves || 0) - (leaveStats?.usedSickLeaves || 0),
    },
    {
      id: 4, // 事假
      name: '事假',
      remainingDays: (leaveStats?.totalPersonalLeaves || 0) - (leaveStats?.usedPersonalLeaves || 0),
    },
    {
      id: 1, // 调休
      name: '调休',
      remainingDays: (leaveStats?.totalCompensatoryLeaves || 0) - (leaveStats?.usedCompensatoryLeaves || 0),
    },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const leaveDays = calculateLeaveDays(data.startDate, data.endDate);
      
      // 处理文件上传
      let proof:string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          try {
            const uploadResponse = await uploadApi.uploadFile({
              uri: file.uri,
              type: file.type,
              name: file.name,
            });
            proof.push(uploadResponse.filename);
          } catch (error) {
            console.error('文件上传失败:', error);
            Alert.alert('错误', '文件上传失败，请重试');
            return;
          }
        }
      }
      
      const formattedData = {
        type: data.leaveType as 1 | 2 | 3 | 4 | 5,
        startDate: format(data.startDate, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(data.endDate, 'yyyy-MM-dd HH:mm:ss'),
        amount: leaveDays.toString(),
        status: 1 as const,
        reason: data.reason,
        proof: proof,
      };

      if (isEdit) {
        await leaveBalanceApi.updateLeaveRequest(
          { id: Number(id) },
          formattedData
        );
        Alert.alert('成功', '请假申请已更新', [
          {
            text: '确定',
            onPress: () => router.replace('/(tabs)/leave-request'),
          },
        ]);
      } else {
        await leaveBalanceApi.createLeaveRequest(formattedData);
        router.back();
      }
    } catch (error) {
      console.error('提交失败:', error);
      Alert.alert('错误', '操作失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoadingRequest) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isEdit && !request) {
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
          {isLoadingStats ? (
            <View className="items-center py-4">
              <Text className="text-gray-500">加载中...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {leaveTypes.map(type => (
                <Controller
                  key={type.id}
                  control={control}
                  name="leaveType"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      className={`flex-1 py-3 px-4 rounded-lg border ${
                        value === type.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 bg-white'
                      }`}
                      onPress={() => onChange(type.id)}
                    >
                      <Text
                        className={`text-center font-bold ${
                          value === type.id ? 'text-primary' : 'text-gray-600'
                        }`}
                      >
                        {type.name}
                      </Text>
                      <Text className="text-center text-gray-500 text-sm mt-1">
                        剩余 {type.remainingDays} 天
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              ))}
            </View>
          )}
          {errors.leaveType && (
            <Text className="text-red-500 text-sm mt-1">{errors.leaveType.message}</Text>
          )}
        </View>

        {/* 请假时间选择 */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">开始时间</Text>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  className="h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 justify-center"
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text className="text-gray-900">
                    {value ? format(value, 'yyyy-MM-dd HH:mm') : '请选择开始时间'}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="datetime"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowStartPicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                    minimumDate={new Date()}
                    minuteInterval={30}
                  />
                )}
              </>
            )}
          />
          {errors.startDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.startDate.message}</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-2">结束时间</Text>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  className="h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 justify-center"
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text className="text-gray-900">
                    {value ? format(value, 'yyyy-MM-dd HH:mm') : '请选择结束时间'}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="datetime"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowEndPicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                    minimumDate={watch('startDate') || new Date()}
                    minuteInterval={30}
                  />
                )}
              </>
            )}
          />
          {errors.endDate && (
            <Text className="text-red-500 text-sm mt-1">{errors.endDate.message}</Text>
          )}
        </View>

        {/* 显示计算出的请假天数 */}
        {watch('startDate') && watch('endDate') && (
          <View className="mb-4">
            <Text className="text-gray-600 mb-2">请假天数</Text>
            <View className="h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 justify-center">
              <Text className="text-gray-900">
                {calculateLeaveDays(watch('startDate'), watch('endDate'))} 天
              </Text>
            </View>
          </View>
        )}

        {/* 请假原因 */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">请假原因</Text>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="h-24 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900"
                multiline
                textAlignVertical="top"
                placeholder="请输入请假原因（至少8个字符）"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.reason && (
            <Text className="text-red-500 text-sm mt-1">{errors.reason.message}</Text>
          )}
        </View>

        {/* 文件上传 */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">上传证明文件（可选）</Text>
          <FileUpload
            onFilesSelected={(selectedFiles) => setFiles(selectedFiles)}
            maxFiles={3}
            allowedTypes={['image/*', 'application/pdf']}
          />
          {isEdit && files.length > 0 && (
            <View className="mt-2">
              <Text className="text-gray-600 mb-2">已有文件：</Text>
              {files.map((file, index) => (
                <View key={index} className="flex-row items-center bg-gray-50 p-2 rounded-lg mb-2">
                  <Text className="flex-1 text-gray-900">{file.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          className={`h-12 rounded-lg justify-center items-center mt-4 mb-8 ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold text-lg">
            {isSubmitting ? '提交中...' : isEdit ? '更新申请' : '提交申请'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 