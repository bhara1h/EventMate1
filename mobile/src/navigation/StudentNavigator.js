import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Compass, Ticket, Clock, User } from 'lucide-react-native';

import DiscoverScreen from '../screens/student/DiscoverScreen';
import PaymentScreen from '../screens/student/PaymentScreen';
import MyTicketsScreen from '../screens/student/MyTicketsScreen';
import HistoryScreen from '../screens/student/HistoryScreen';
import ProfileScreen from '../screens/student/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DiscoverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

export default function StudentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Discover') return <Compass color={color} size={size} />;
          if (route.name === 'MyTickets') return <Ticket color={color} size={size} />;
          if (route.name === 'History') return <Clock color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverStack} options={{ title: 'Events' }} />
      <Tab.Screen name="MyTickets" component={MyTicketsScreen} options={{ title: 'Tickets' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
