import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '../../src/components/navigation/haptic-tab';
import { IconSymbol } from '../../src/components/ui/icon-symbol';
import { Colors } from '../../src/constants/theme';
import { useColorScheme } from '../../src/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          title: 'Admins',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
