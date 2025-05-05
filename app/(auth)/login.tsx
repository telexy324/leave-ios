import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('错误', '请输入邮箱和密码');
      return;
    }

    try {
      setIsLoading(true);
      await login({
        username: email,
        password: password,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('登录失败', error.message || '请检查您的邮箱和密码是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-gray-50">
      <Text className="text-2xl font-bold text-center mb-8">请假管理系统</Text>
      <View className="bg-white p-5 rounded-lg shadow-md">
        <TextInput
          className="h-12 border border-gray-200 rounded-md px-4 mb-4"
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TextInput
          className="h-12 border border-gray-200 rounded-md px-4 mb-4"
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
        <View className="flex-row items-center mb-5">
          <TouchableOpacity
            className="w-5 h-5 border border-gray-200 rounded mr-2.5 justify-center items-center"
            onPress={() => setRememberMe(!rememberMe)}
            disabled={isLoading}
          >
            {rememberMe && <View className="w-3 h-3 rounded bg-blue-500" />}
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">记住我</Text>
        </View>
        <TouchableOpacity
          className={`h-12 rounded-md justify-center items-center mb-4 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-base">
            {isLoading ? '登录中...' : '登录'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push('/(auth)/forgot-password' as any)}
          disabled={isLoading}
        >
          <Text className="text-blue-500 text-sm">忘记密码？</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 