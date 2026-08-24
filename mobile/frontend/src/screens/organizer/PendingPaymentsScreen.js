import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import { CheckCircle2, XCircle } from 'lucide-react-native';

export default function PendingPaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get('/payments/pending');
      setPayments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments();
  };

  const handleVerify = async (paymentId, status) => {
    try {
      await api.post(`/payments/${paymentId}/verify-manual`, { status });
      fetchPayments();
    } catch (error) {
      console.error(error);
    }
  };

  const renderPayment = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl border border-slate-100 shadow-sm mx-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-bold text-slate-800 text-lg flex-1">{item.event?.title}</Text>
        <Text className="font-black text-blue-600">₹{item.amount}</Text>
      </View>
      
      <View className="mb-3 gap-y-1">
        <Text className="text-slate-600 text-sm"><Text className="font-bold">Student:</Text> {item.user?.name}</Text>
        <Text className="text-slate-600 text-sm"><Text className="font-bold">TxID:</Text> {item.transactionId}</Text>
        {item.screenshotUrl && (
          <TouchableOpacity onPress={() => Linking.openURL(item.screenshotUrl)}>
            <Text className="text-blue-600 font-bold text-sm underline mt-1">View Screenshot</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row gap-x-2 pt-2 border-t border-slate-100 mt-1">
        <TouchableOpacity 
          className="flex-1 bg-green-50 py-2 rounded-lg flex-row justify-center items-center mr-1"
          onPress={() => handleVerify(item._id, 'approve')}
        >
          <CheckCircle2 size={16} color="#16a34a" />
          <Text className="text-green-700 font-bold ml-1 text-sm">Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-1 bg-red-50 py-2 rounded-lg flex-row justify-center items-center ml-1"
          onPress={() => handleVerify(item._id, 'reject')}
        >
          <XCircle size={16} color="#dc2626" />
          <Text className="text-red-600 font-bold ml-1 text-sm">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-2xl font-extrabold text-slate-800">Pending Payments</Text>
        <Text className="text-slate-500">Verify manual student payments</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={item => item._id}
          renderItem={renderPayment}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No pending payments.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
