import { useAuthStore } from '@/lib/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';

export default function AppLayout() {
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);
  }, [user, isAdmin]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6', // 蓝色
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#3b82f6',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="approval/index"
        options={{
          title: '审批',
          tabBarItemStyle: isAdmin ? undefined : { display: 'none' },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave-request/index"
        options={{
          title: '请假',
          tabBarItemStyle: isAdmin ? { display: 'none' } : undefined,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar-number' : 'calendar-number-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave-request/new"
        options={{
          title: '新增',
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name="leave-request/[id]"
        options={{
          title: '详情',
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name="leave-request/edit/[id]"
        options={{
          title: '编辑',
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name="approval/[id]"
        options={{
          title: '审批',
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
      <Tabs.Screen
        name="profile/change-password"
        options={{
          href: null,
          tabBarItemStyle: {
            display: 'none'
          }
        }}
      />
    </Tabs>
  );
} 