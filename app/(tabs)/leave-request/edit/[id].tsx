import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import FileUpload from '@/components/app/FileUpload';

interface LeaveType {
  id: string;
  name: string;
  remainingDays: number;
}

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  attachments?: Array<{ name: string; uri: string }>;
}

// 模拟数据
const mockLeaveTypes: LeaveType[] = [
  { id: '1', name: '年假', remainingDays: 10 },
  { id: '2', name: '病假', remainingDays: 15 },
  { id: '3', name: '事假', remainingDays: 5 },
];

const mockLeaveRequest: LeaveRequest = {
  id: '1',
  leaveType: '1',
  startDate: '2024-03-15',
  endDate: '2024-03-16',
  days: 2,
  reason: '个人事务',
  attachments: [
    { name: '请假证明.pdf', uri: 'file:///path/to/file.pdf' },
  ],
};

export default function EditLeaveRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; uri: string }>>([]);

  useEffect(() => {
    // TODO: 根据 id 获取请假申请数据
    const request = mockLeaveRequest;
    setSelectedLeaveType(request.leaveType);
    setStartDate(new Date(request.startDate));
    setEndDate(new Date(request.endDate));
    setReason(request.reason);
    setAttachments(request.attachments || []);
  }, [id]);

  const handleSubmit = () => {
    if (!selectedLeaveType) {
      Alert.alert('提示', '请选择请假类型');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('提示', '请填写请假原因');
      return;
    }

    // TODO: 实现修改逻辑，发送到后端
    console.log('Update:', {
      id,
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
          <Text className="text-white font-bold text-base">保存修改</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 