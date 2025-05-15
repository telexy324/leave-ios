import React, { useState } from 'react';
import {
    ActivityIndicator,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setComment('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center bg-black/50"
      >
        <View 
          className="w-[75%] max-w-[320px] bg-white rounded-lg p-5"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-lg font-bold mb-4">
            {type === 'approve' ? '审批通过' : '审批拒绝'}
          </Text>
          <TextInput
            className="h-32 border border-gray-200 rounded-md px-4 py-2 text-base mb-4"
            placeholder="请输入审批意见"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={comment}
            onChangeText={setComment}
            editable={!isSubmitting}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="w-[48%] h-12 bg-gray-200 rounded-lg justify-center items-center"
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text className="text-gray-800 font-bold text-base">取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-[48%] h-12 rounded-lg justify-center items-center ${
                type === 'approve' ? 'bg-blue-500' : 'bg-red-500'
              }`}
              onPress={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              style={{ elevation: 2 }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-base">确定</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
} 