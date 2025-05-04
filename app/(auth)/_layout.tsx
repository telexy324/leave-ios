import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: '登录',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: '忘记密码',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: '修改密码',
        }}
      />
    </Stack>
  );
} 