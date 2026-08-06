import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, PlusCircle, CreditCard, ScanLine, User } from 'lucide-react-native';

import DashboardScreen from '../screens/organizer/DashboardScreen';
import CreateEventScreen from '../screens/organizer/CreateEventScreen';
import PendingPaymentsScreen from '../screens/organizer/PendingPaymentsScreen';
import ScanScreen from '../screens/organizer/ScanScreen';

const Tab = createBottomTabNavigator();

export default function OrganizerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <LayoutDashboard color={color} size={size} />;
          if (route.name === 'CreateEvent') return <PlusCircle color={color} size={size} />;
          if (route.name === 'Payments') return <CreditCard color={color} size={size} />;
          if (route.name === 'Scan') return <ScanLine color={color} size={size} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="Payments" component={PendingPaymentsScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
    </Tab.Navigator>
  );
}
