import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '../../src/components/navigation/haptic-tab';
import { IconSymbol } from '../../src/components/ui/icon-symbol';
import { Colors } from '../../src/constants/theme';
import { useAuth } from '../../src/features/auth/context/auth-context';
import { useColorScheme } from '../../src/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#D5DBDB' : '#565959',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#131921' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#232F3E' : '#D5D9D9',
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Basics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="state"
        options={{
          title: 'State',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="slider.horizontal.3" color={color} />,
        }}
      />
      <Tabs.Screen
        name="patterns"
        options={{
          title: 'Patterns',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
