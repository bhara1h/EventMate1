import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import QRCode from 'react-native-qrcode-svg';

export default function MyTicketsScreen() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/events/mytickets');
      setTickets(data.filter(t => !t.hasAttended));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderTicket = ({ item }) => {
    const isPaidOrFree = ['Completed', 'Paid', 'Free'].includes(item.paymentStatus);
    const isPending = ['Pending', 'Payment Pending'].includes(item.paymentStatus);

    return (
      <View className="bg-white rounded-2xl mb-4 overflow-hidden border border-slate-200 shadow-sm mx-4">
        <View className="bg-blue-600 p-4">
          <Text className="text-white font-bold text-xl">{item.event?.title || 'Unknown Event'}</Text>
          <Text className="text-blue-100 text-sm">{new Date(item.event?.date).toLocaleDateString()} • {item.event?.time}</Text>
        </View>
        
        <View className="p-6 items-center border-b border-slate-100 border-dashed">
          {isPaidOrFree ? (
            <>
              <View className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-4">
                <QRCode value={item.qrCodeData || item.qrCode || 'invalid'} size={150} />
              </View>
              <Text className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                ID: {(item.qrCodeData || item.qrCode || '').slice(0, 8)}
              </Text>
            </>
          ) : (
            <View className="h-[150px] justify-center items-center">
              <Text className="text-3xl mb-2">⏳</Text>
              <Text className="text-sm font-bold uppercase tracking-wide text-amber-600">Payment Pending</Text>
              <Text className="text-xs text-slate-400 mt-1 text-center">Waiting for organizer approval.</Text>
            </View>
          )}
        </View>

        <View className="p-4 bg-slate-50 flex-row justify-between items-center">
          <Text className="text-xs text-slate-500 flex-1">📍 {item.event?.location}</Text>
          <View className={`px-2 py-1 rounded ${isPaidOrFree ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Text className={`text-xs font-bold ${isPaidOrFree ? 'text-green-800' : 'text-amber-800'}`}>
              {item.paymentStatus === 'Completed' ? 'Paid' : item.paymentStatus}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item._id}
          renderItem={renderTicket}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No upcoming tickets.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
