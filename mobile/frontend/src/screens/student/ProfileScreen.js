import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-6 py-8 items-center border-b border-slate-200 bg-white shadow-sm">
        <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4">
          <User size={40} color="#fff" />
        </View>
        <Text className="text-2xl font-bold text-slate-800">{user?.name || 'User Profile'}</Text>
        <Text className="text-blue-600 font-medium">{user?.role}</Text>
      </View>

      <View className="p-6 gap-y-4">
        {user?.email && (
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</Text>
            <Text className="text-lg text-slate-800">{user.email}</Text>
          </View>
        )}
        {user?.college && (
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">College</Text>
            <Text className="text-lg text-slate-800">{user.college}</Text>
          </View>
        )}
      </View>

      <View className="px-6 mt-auto mb-10">
        <TouchableOpacity 
          className="bg-red-50 py-4 rounded-xl flex-row justify-center items-center"
          onPress={logout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold ml-2 text-lg">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
