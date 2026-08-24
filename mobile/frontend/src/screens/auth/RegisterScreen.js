import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Lock, Phone } from 'lucide-react-native';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  
  const [role, setRole] = useState('Student'); // Student or Organizer
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    college: '',
    studentId: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Name, Email, and Password are required');
      return;
    }
    setLoading(true);
    try {
      const response = await register({ ...formData, role });
      Alert.alert('Success', response.message || 'Registration successful! Please check your email to verify your account.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <View className="mb-8 mt-4">
          <Text className="text-3xl font-extrabold text-blue-600 mb-2">Create Account</Text>
          <Text className="text-base text-slate-500">Join EventMate to explore or host events.</Text>
        </View>

        {/* Role Toggle */}
        <View className="flex-row bg-slate-200 p-1 rounded-xl mb-6">
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${role === 'Student' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setRole('Student')}
          >
            <Text className={`font-bold ${role === 'Student' ? 'text-blue-600' : 'text-slate-500'}`}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`flex-1 py-3 rounded-lg items-center ${role === 'Organizer' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setRole('Organizer')}
          >
            <Text className={`font-bold ${role === 'Organizer' ? 'text-blue-600' : 'text-slate-500'}`}>Organizer</Text>
          </TouchableOpacity>
        </View>

        <View className="gap-y-4">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
            <User size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-slate-800 text-base"
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>

          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
            <Mail size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-slate-800 text-base"
              placeholder="Email Address"
              autoCapitalize="none"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
          </View>

          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
            <Phone size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-slate-800 text-base"
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
          </View>

          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
            <Lock size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-slate-800 text-base"
              placeholder="Password"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
            />
          </View>

          {role === 'Student' && (
            <>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
                <TextInput
                  className="flex-1 text-slate-800 text-base"
                  placeholder="College Name"
                  value={formData.college}
                  onChangeText={(text) => handleChange('college', text)}
                />
              </View>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
                <TextInput
                  className="flex-1 text-slate-800 text-base"
                  placeholder="Student ID / Roll No"
                  value={formData.studentId}
                  onChangeText={(text) => handleChange('studentId', text)}
                />
              </View>
            </>
          )}

          {role === 'Organizer' && (
            <>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
                <TextInput
                  className="flex-1 text-slate-800 text-base"
                  placeholder="College Name"
                  value={formData.college}
                  onChangeText={(text) => handleChange('college', text)}
                />
              </View>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
                <TextInput
                  className="flex-1 text-slate-800 text-base"
                  placeholder="Department / Organization"
                  value={formData.department}
                  onChangeText={(text) => handleChange('department', text)}
                />
              </View>
            </>
          )}

          <TouchableOpacity 
            className="bg-blue-600 rounded-xl py-4 mt-6 shadow-sm flex-row justify-center items-center"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-slate-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-blue-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
