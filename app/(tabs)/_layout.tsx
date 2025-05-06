import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';

export default function AppLayout() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);
  }, [user, isAdmin]);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'leave-request/index') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'calendar') {
            iconName = focused ? 'calendar-number' : 'calendar-number-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'approval/index') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
        }}
      />
      {isAdmin === true ? (
        <Tabs.Screen
          name="approval/index"
          options={{
            title: '审批',
          }}
        />
      ) : (
        <Tabs.Screen
          name="leave-request/index"
          options={{
            title: '请假',
          }}
        />
      )}
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
        }}
      />
      <Tabs.Screen
        name="leave-request/new"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="leave-request/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="leave-request/edit/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="approval/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/change-password"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
} 