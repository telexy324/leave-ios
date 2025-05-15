import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface FileUploadProps {
  onFilesSelected: (files: File) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  onFilesRemoved: (files: File) => void;
}

interface File {
  name: string;
  uri: string;
  type: string;
  size: number;
  hash?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileHash = async (uri: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      return '';
    }
    // 读取文件的前 1024 字节作为简单的哈希值
    const fileContent = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
      length: 1024,
    });
    return fileContent;
  } catch (error) {
    console.error('Error getting file hash:', error);
    return '';
  }
};

export default function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  allowedTypes = ['image/*', 'application/pdf'],
  onFilesRemoved,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const showAlert = (title: string, message: string) => {
    Alert.alert(
      title,
      message,
      [{ text: '确定', style: 'default' }],
      { cancelable: true }
    );
  };

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
        showAlert('提示', `最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      // 检查文件是否已存在
      const isDuplicate = files.some(file => 
        file.name === newFile.name && file.size === newFile.size
      );
      
      if (isDuplicate) {
        showAlert('提示', `文件 "${newFile.name}" 已存在，请勿重复上传`);
        return;
      }

      const newFiles = [...files, newFile];
      setFiles(newFiles);
      onFilesSelected(newFile);
    } catch (error) {
      console.error('Error picking document:', error);
      showAlert('错误', '选择文件时出错');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        selectionLimit: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const fileHash = await getFileHash(asset.uri);
      
      const newFile = {
        name: asset.fileName || asset.uri.split('/').pop() || 'image.jpg',
        uri: asset.uri,
        type: 'image/jpeg',
        size: asset.fileSize || 0,
        hash: fileHash,
      };

      if (files.length >= maxFiles) {
        showAlert('提示', `最多只能上传 ${maxFiles} 个文件`);
        return;
      }

      // 检查文件是否已存在
      const isDuplicate = files.some(file => 
        file.hash === newFile.hash && file.hash !== ''
      );
      
      if (isDuplicate) {
        showAlert('提示', `图片已存在，请勿重复上传`);
        return;
      }

      const newFiles = [...files, newFile];
      setFiles(newFiles);
      onFilesSelected(newFile);
    } catch (error) {
      console.error('Error picking image:', error);
      showAlert('错误', '选择图片时出错');
    }
  };

  const removeFile = (index: number) => {
    const removedFile = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesRemoved(removedFile);
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
                <View className="flex-1">
                  <Text className="text-gray-800" numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {formatFileSize(file.size)}
                  </Text>
                </View>
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