import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { perms } = useAuth();
  const isAdmin = perms?.some(perm => {return perm === 'admin'})

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'leave-request') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'calendar') {
            iconName = focused ? 'calendar-number' : 'calendar-number-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
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
      <Tabs.Screen
        name="leave-request"
        options={{
          title: '请假',
        }}
      />
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
      {isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: '管理',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      )}
    </Tabs>
  );
} 