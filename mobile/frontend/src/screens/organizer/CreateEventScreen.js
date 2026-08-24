import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';

export default function CreateEventScreen({ navigation }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '0',
    isFree: true,
    posterImage: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.location) {
      Alert.alert('Error', 'Please fill required fields (Title, Date, Location)');
      return;
    }

    setLoading(true);
    try {
      const submitData = { ...formData, price: formData.isFree ? 0 : Number(formData.price) };
      await api.post('/events', submitData);
      Alert.alert('Success', 'Event created successfully! Pending admin approval.');
      // Reset form
      setFormData({
        title: '', description: '', category: 'Technical', date: '', time: '',
        location: '', capacity: '', price: '0', isFree: true, posterImage: ''
      });
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-extrabold text-slate-800 mb-6">Create New Event</Text>

        <View className="gap-y-4">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-1">Event Title *</Text>
            <TextInput
              className="bg-white border border-slate-200 rounded-xl px-4 py-3"
              value={formData.title}
              onChangeText={(t) => handleChange('title', t)}
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-1">Description</Text>
            <TextInput
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 h-24"
              multiline
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(t) => handleChange('description', t)}
            />
          </View>

          <View className="flex-row gap-x-4">
            <View className="flex-1 mr-2">
              <Text className="text-sm font-bold text-slate-700 mb-1">Date (YYYY-MM-DD) *</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3"
                value={formData.date}
                onChangeText={(t) => handleChange('date', t)}
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm font-bold text-slate-700 mb-1">Time (HH:MM)</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3"
                value={formData.time}
                onChangeText={(t) => handleChange('time', t)}
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-slate-700 mb-1">Location *</Text>
            <TextInput
              className="bg-white border border-slate-200 rounded-xl px-4 py-3"
              value={formData.location}
              onChangeText={(t) => handleChange('location', t)}
            />
          </View>
          
          <View className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 mt-2">
            <Text className="text-sm font-bold text-slate-700">Is this a Free Event?</Text>
            <Switch
              value={formData.isFree}
              onValueChange={(val) => handleChange('isFree', val)}
              trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
              thumbColor={formData.isFree ? '#2563eb' : '#f8fafc'}
            />
          </View>

          {!formData.isFree && (
            <View>
              <Text className="text-sm font-bold text-slate-700 mb-1">Ticket Price (₹)</Text>
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(t) => handleChange('price', t)}
              />
            </View>
          )}

          <TouchableOpacity 
            className="bg-blue-600 rounded-xl py-4 mt-6 items-center shadow-sm"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Create Event</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
