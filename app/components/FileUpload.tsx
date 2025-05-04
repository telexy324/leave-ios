import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
}

interface File {
  name: string;
  uri: string;
  type: string;
  size: number;
}

export default function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  allowedTypes = ['image/*', 'application/pdf'],
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const newFile = {
        name: result.assets[0].name,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || '',
        size: result.assets[0].size || 0,
      };

      if (files.length >= maxFiles) {
        Alert.alert('提示', `最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      const newFiles = [...files, newFile];
      setFiles(newFiles);
      onFilesSelected(newFiles);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('错误', '选择文件时出错');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const newFile = {
        name: result.assets[0].uri.split('/').pop() || 'image.jpg',
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        size: 0, // 图片大小需要额外处理
      };

      if (files.length >= maxFiles) {
        Alert.alert('提示', `最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      const newFiles = [...files, newFile];
      setFiles(newFiles);
      onFilesSelected(newFiles);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('错误', '选择图片时出错');
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <View className="space-y-4">
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 h-12 bg-gray-100 rounded-lg justify-center items-center"
          onPress={pickDocument}
        >
          <Text className="text-gray-800 font-bold text-base">选择文件</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-12 bg-gray-100 rounded-lg justify-center items-center"
          onPress={pickImage}
        >
          <Text className="text-gray-800 font-bold text-base">选择图片</Text>
        </TouchableOpacity>
      </View>

      {files.length > 0 && (
        <View className="space-y-2">
          {files.map((file, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <View className="flex-row items-center flex-1">
                {file.type.startsWith('image/') ? (
                  <Image
                    source={{ uri: file.uri }}
                    className="w-10 h-10 rounded mr-3"
                  />
                ) : (
                  <View className="w-10 h-10 bg-gray-200 rounded mr-3 justify-center items-center">
                    <Ionicons name="document" size={24} color="#666" />
                  </View>
                )}
                <Text className="flex-1 text-gray-800" numberOfLines={1}>
                  {file.name}
                </Text>
              </View>
              <TouchableOpacity
                className="ml-3"
                onPress={() => removeFile(index)}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
} 