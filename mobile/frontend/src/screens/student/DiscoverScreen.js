import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';
import { MapPin, Calendar, Clock } from 'lucide-react-native';

export default function DiscoverScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    if (event.isFree) {
      try {
        const { data } = await api.post('/payments/create-order', { eventId: event._id });
        if (data.success) {
          Alert.alert('Success', 'Registered successfully!');
          // Ideally navigate to Tickets tab or refresh
        }
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Error registering');
      }
    } else {
      // Navigate to Payment Screen (we will create this)
      navigation.navigate('Payment', { event });
    }
  };

  const renderEvent = ({ item }) => (
    <View className="bg-white rounded-2xl mb-4 overflow-hidden border border-slate-100 shadow-sm mx-4">
      <View className="h-40 bg-slate-200">
        {item.posterImage ? (
          <Image source={{ uri: item.posterImage }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400 font-bold">Event</Text>
          </View>
        )}
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-xl font-bold text-slate-800 flex-1">{item.title}</Text>
          <Text className="text-blue-600 font-bold ml-2 text-lg">
            {item.isFree ? 'Free' : `₹${item.price}`}
          </Text>
        </View>
        
        <Text className="text-slate-500 mb-3" numberOfLines={2}>{item.description}</Text>
        
        <View className="flex-row items-center mb-1">
          <Calendar size={14} color="#64748b" />
          <Text className="text-slate-500 text-xs ml-1">{new Date(item.date).toLocaleDateString()}</Text>
          <Clock size={14} color="#64748b" className="ml-3" />
          <Text className="text-slate-500 text-xs ml-1">{item.time}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <MapPin size={14} color="#64748b" />
          <Text className="text-slate-500 text-xs ml-1">{item.location}</Text>
        </View>

        <TouchableOpacity 
          className="bg-blue-600 py-3 rounded-xl items-center"
          onPress={() => handleRegister(item)}
        >
          <Text className="text-white font-bold">Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="px-4 py-4">
        <Text className="text-2xl font-extrabold text-slate-800">Discover Events</Text>
        <Text className="text-slate-500">Find and join exciting campus events</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item._id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text className="text-center text-slate-500 mt-10">No upcoming events.</Text>}
        />
      )}
    </SafeAreaView>
  );
}
