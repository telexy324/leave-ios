import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import FileUpload from '../../components/FileUpload';

interface LeaveType {
  id: string;
  name: string;
  remainingDays: number;
}

// 模拟数据
const mockLeaveTypes: LeaveType[] = [
  { id: '1', name: '年假', remainingDays: 10 },
  { id: '2', name: '病假', remainingDays: 15 },
  { id: '3', name: '事假', remainingDays: 5 },
];

export default function NewLeaveRequestScreen() {
  const router = useRouter();
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; uri: string }>>([]);

  const handleSubmit = () => {
    // TODO: 实现提交逻辑，发送到后端
    console.log('Submit:', {
      leaveType: selectedLeaveType,
      startDate,
      endDate,
      reason,
      attachments,
    });
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        {/* 请假类型选择 */}
        <View className="mb-5">
          <Text className="text-lg font-bold mb-3">请假类型</Text>
          <View className="flex-row space-x-3">
            {mockLeaveTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  selectedLeaveType === type.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 bg-white'
                }`}
                onPress={() => setSelectedLeaveType(type.id)}
              >
                <Text
                  className={`text-center font-bold ${
                    selectedLeaveType === type.id ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {type.name}
                </Text>
                <Text className="text-center text-gray-500 text-sm mt-1">
                  剩余 {type.remainingDays} 天
                </Text>
              </TouchableOpacity>
            ))}
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
                mode="date"
                display="default"
                onChange={(event, date) => date && setStartDate(date)}
              />
            </View>
            <View>
              <Text className="text-gray-600 mb-1">结束时间</Text>
              <DateTimePicker
                value={endDate}
                mode="date"
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
            value={attachments}
            onChange={setAttachments}
            maxFiles={3}
            allowedTypes={['image/*', 'application/pdf']}
          />
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          className="h-12 bg-primary rounded-lg justify-center items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-base">提交申请</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 