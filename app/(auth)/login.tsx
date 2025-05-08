import { useAuthStore } from '@/lib/store/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

// 定义表单验证 schema
const schema = z.object({
  username: z.string(),
  password: z.string()
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await login({
        username: data.username,
        password: data.password,
      });
      router.push('/(tabs)/profile');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('登录失败', error.message || '请检查您的用户名和密码是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-5 bg-gray-50">
      <Text className="text-2xl font-bold text-center mb-8">请假管理系统</Text>
      <View className="bg-white p-5 rounded-lg shadow-md">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                className="h-12 border border-gray-200 rounded-md px-4 mb-1"
                placeholder="用户名"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.username && (
                <Text className="text-red-500 text-sm mb-2">{errors.username.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                className="h-12 border border-gray-200 rounded-md px-4 mb-1"
                placeholder="密码"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mb-2">{errors.password.message}</Text>
              )}
            </View>
          )}
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
          onPress={handleSubmit(onSubmit)}
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