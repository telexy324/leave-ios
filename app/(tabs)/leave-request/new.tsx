import { leaveBalanceApi } from '@/lib/leaveBalance';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

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

export default function NewLeaveRequestScreen() {
  const router = useRouter();
  const [attachments, setAttachments] = React.useState<Array<{ name: string; uri: string }>>([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用 React Query 获取假期统计
  const { data: leaveStats, isLoading } = useQuery({
    queryKey: ['leaveStats'],
    queryFn: () => leaveBalanceApi.getLeaveStats(),
  });

  // 初始化表单
  const {
    control,
    handleSubmit,
    watch,
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

  // 添加计算请假天数的函数
  const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
    const diffInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    // 如果时间差小于等于0，返回0
    if (diffInHours <= 0) return 0;
    
    // 计算完整的天数
    const fullDays = Math.floor(diffInHours / 24);
    
    // 计算剩余的小时数
    const remainingHours = diffInHours % 24;
    
    // 如果剩余时间超过8小时，算作一天
    if (remainingHours >= 8) {
      return fullDays + 1;
    }
    
    // 如果剩余时间不足8小时，按小时计算
    return fullDays + Math.floor(remainingHours / 8);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const leaveDays = calculateLeaveDays(data.startDate, data.endDate);
      
      const formattedData = {
        type: data.leaveType as 1 | 2 | 3 | 4 | 5,
        startDate: format(data.startDate, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(data.endDate, 'yyyy-MM-dd HH:mm:ss'),
        amount: leaveDays.toString(),
        status: 1 as const,
        reason: data.reason,
        proof: data.proof || undefined,
      };
      console.log(formattedData)
      await leaveBalanceApi.createLeaveRequest(formattedData)
      router.back();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 请假类型选择 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">请假类型</Text>
          {isLoading ? (
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
                className="h-24 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
                placeholder="请输入请假原因"
                multiline
                textAlignVertical="top"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.reason && (
            <Text className="text-red-500 text-sm mt-1">{errors.reason.message}</Text>
          )}
        </View>

        {/* 附件上传 */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">上传附件（选填）</Text>
          <Controller
            control={control}
            name="proof"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                className="h-24 border-2 border-dashed border-gray-300 rounded-lg justify-center items-center"
                onPress={() => {
                  // 处理文件上传
                }}
              >
                <View className="items-center">
                  <Ionicons name="cloud-upload-outline" size={24} color="#6B7280" />
                  <Text className="text-gray-500 mt-2">点击上传附件</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* 提交按钮 */}
        <View className="mt-6 mb-8">
          <TouchableOpacity
            className={`h-12 rounded-lg justify-center items-center ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-500'
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white font-bold text-base">
              {isSubmitting ? '提交中...' : '提交申请'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 