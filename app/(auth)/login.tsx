import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password, rememberMe);
    } catch (error) {
      console.log('Login error:', error);
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
        />
        <TextInput
          className="h-12 border border-gray-200 rounded-md px-4 mb-4"
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View className="flex-row items-center mb-5">
          <TouchableOpacity
            className="w-5 h-5 border border-gray-200 rounded mr-2.5 justify-center items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && <View className="w-3 h-3 rounded bg-primary" />}
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">记住我</Text>
        </View>
        <TouchableOpacity
          className="h-12 bg-primary rounded-md justify-center items-center mb-4"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-base">登录</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push('/forgot-password')}
        >
          <Text className="text-primary text-sm">忘记密码？</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 