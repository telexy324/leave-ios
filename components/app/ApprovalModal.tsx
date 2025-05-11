import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ApprovalModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  type: 'approve' | 'reject';
}

export default function ApprovalModal({
  visible,
  onClose,
  onSubmit,
  type,
}: ApprovalModalProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center bg-black/50"
      >
        <View className="w-[90%] max-w-[400px] bg-white rounded-lg p-5 shadow-lg">
          <Text className="text-lg font-bold mb-4">
            {type === 'approve' ? '审批通过' : '审批拒绝'}
          </Text>
          <TextInput
            className="h-32 border border-gray-200 rounded-md px-4 py-2 text-base mb-4"
            placeholder="请输入审批意见"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="w-[48%] h-12 bg-gray-200 rounded-lg justify-center items-center"
              onPress={onClose}
            >
              <Text className="text-gray-800 font-bold text-base">取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-[48%] h-12 rounded-lg justify-center items-center ${
                type === 'approve' ? 'bg-blue-500' : 'bg-red-500'
              }`}
              onPress={handleSubmit}
              style={{ elevation: 2 }}
            >
              <Text className="text-white font-bold text-base">确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
} 