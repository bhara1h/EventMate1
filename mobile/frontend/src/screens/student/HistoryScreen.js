import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import { Award } from 'lucide-react-native';

export default function HistoryScreen() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/events/mytickets');
      setTickets(data);
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

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl border border-slate-100 shadow-sm mx-4 flex-row justify-between items-center">
      <View className="flex-1">
        <Text className="font-bold text-slate-800 text-lg mb-1">{item.event?.title}</Text>
        <Text className="text-slate-500 text-xs mb-2">
          {new Date(item.registeredAt).toLocaleDateString()}
        </Text>
        <View className="flex-row items-center gap-x-2">
          <View className={`px-2 py-1 rounded ${item.hasAttended ? 'bg-green-100' : 'bg-slate-100'}`}>
            <Text className={`text-xs font-bold ${item.hasAttended ? 'text-green-800' : 'text-slate-500'}`}>
              {item.hasAttended ? 'Attended' : 'Pending'}
            </Text>
          </View>
          <View className="px-2 py-1 bg-slate-100 rounded ml-2">
            <Text className="text-xs font-mono text-slate-600">
              Tx: {(item.transactionId || 'N/A').slice(0, 10)}
            </Text>
          </View>
        </View>
      </View>
      
      {item.certificateUrl && (
        <View className="ml-4 items-center">
          <Award size={24} color="#7c3aed" onPress={() => Linking.openURL(item.certificateUrl)} />
          <Text className="text-[10px] text-purple-700 font-bold mt-1">{item.certificateRole}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-2xl font-extrabold text-slate-800">History & Certificates</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No history found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
