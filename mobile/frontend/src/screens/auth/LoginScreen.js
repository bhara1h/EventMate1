import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center px-6">
      <View className="mb-8">
        <Text className="text-4xl font-extrabold text-blue-600 mb-2">EventMate</Text>
        <Text className="text-lg text-slate-500">Welcome back! Sign in to continue.</Text>
      </View>

      <View className="gap-y-4">
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
          <Mail size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-slate-800 text-base"
            placeholder="Email Address"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
          <Lock size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-slate-800 text-base"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          className="bg-blue-600 rounded-xl py-4 mt-2 shadow-sm flex-row justify-center items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-blue-600 font-bold">Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
