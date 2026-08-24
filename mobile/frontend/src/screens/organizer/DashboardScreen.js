import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import { Users, IndianRupee, LogOut } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes] = await Promise.all([
        api.get('/events/organizer/stats'),
        api.get('/events/myevents')
      ]);
      setStats(statsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderEvent = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl border border-slate-100 shadow-sm mx-4">
      <Text className="font-bold text-slate-800 text-lg">{item.title}</Text>
      <Text className="text-slate-500 text-xs mb-3">{new Date(item.date).toLocaleDateString()}</Text>
      
      <View className="flex-row justify-between bg-slate-50 p-3 rounded-lg">
        <View className="items-center">
          <Text className="text-xs text-slate-500 uppercase font-bold">Capacity</Text>
          <Text className="font-bold text-slate-800">{item.capacity}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-slate-500 uppercase font-bold">Registered</Text>
          <Text className="font-bold text-blue-600">{item.registeredCount || 0}</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-slate-500 uppercase font-bold">Status</Text>
          <Text className={`font-bold ${item.status === 'Approved' ? 'text-green-600' : 'text-amber-500'}`}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-4 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-extrabold text-slate-800">Dashboard</Text>
          <Text className="text-slate-500">Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} className="p-2 bg-slate-200 rounded-full">
          <LogOut size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item._id}
          ListHeaderComponent={
            stats && (
              <View className="flex-row px-4 mb-6 gap-x-4">
                <View className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-row items-center">
                  <View className="bg-blue-100 p-3 rounded-full mr-3">
                    <Users size={24} color="#2563eb" />
                  </View>
                  <View>
                    <Text className="text-xs text-slate-500 uppercase font-bold">Total Attendees</Text>
                    <Text className="text-xl font-black text-slate-800">{stats.totalRegistrations}</Text>
                  </View>
                </View>
                
                <View className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-row items-center">
                  <View className="bg-green-100 p-3 rounded-full mr-3">
                    <IndianRupee size={24} color="#16a34a" />
                  </View>
                  <View>
                    <Text className="text-xs text-slate-500 uppercase font-bold">Revenue</Text>
                    <Text className="text-xl font-black text-slate-800">₹{stats.totalRevenue}</Text>
                  </View>
                </View>
              </View>
            )
          }
          renderItem={renderEvent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No events created yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
