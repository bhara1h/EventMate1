import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

export default function PaymentScreen({ route, navigation }) {
  const { event } = route.params;
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId || !screenshotUrl) {
      Alert.alert('Error', 'Please provide both Transaction ID and Screenshot URL');
      return;
    }
    
    setLoading(true);
    try {
      // Submit manual payment details
      const paymentRes = await api.post('/payments/manual-submit', {
        eventId: event._id,
        transactionId,
        screenshotUrl
      });
      
      if (paymentRes.data.success) {
        Alert.alert('Success', 'Payment submitted! Awaiting organizer approval.');
        navigation.navigate('MyTickets');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-slate-800 mb-2">Complete Payment</Text>
        <Text className="text-slate-500 mb-6">Pay for {event.title}</Text>

        <View className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6 items-center">
          <Text className="text-sm text-slate-500 mb-1">Amount to Pay</Text>
          <Text className="text-4xl font-black text-blue-600">₹{event.price}</Text>
          <Text className="text-xs text-slate-400 mt-2 text-center">
            Please transfer the amount using UPI to the organizer's number/VPA and upload the details below.
          </Text>
        </View>

        <View className="gap-y-4">
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-1">Transaction ID (UTR)</Text>
            <TextInput
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
              placeholder="e.g. 301234567890"
              value={transactionId}
              onChangeText={setTransactionId}
            />
          </View>
          
          <View>
            <Text className="text-sm font-bold text-slate-700 mb-1">Payment Screenshot URL (Drive/ImgBB)</Text>
            <TextInput
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
              placeholder="https://..."
              value={screenshotUrl}
              onChangeText={setScreenshotUrl}
            />
          </View>

          <TouchableOpacity 
            className="bg-blue-600 rounded-xl py-4 mt-4 shadow-sm items-center"
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Submit Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
