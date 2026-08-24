import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../utils/api';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setProcessing(true);
    try {
      // data should be the qrCodeData (registration ID or string)
      const res = await api.post('/events/registrations/attendance', { qrCodeData: data });
      if (res.data.success) {
        Alert.alert('Success', 'Attendance marked successfully!', [
          { text: 'Scan Next', onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid or already marked ticket', [
        { text: 'Try Again', onPress: () => setScanned(false) }
      ]);
    } finally {
      setProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" /></View>;
  }
  if (hasPermission === false) {
    return <View className="flex-1 justify-center items-center"><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <View className="p-4 bg-slate-900 items-center">
        <Text className="text-white text-xl font-bold">Scan Ticket</Text>
        <Text className="text-slate-400">Position the QR code inside the frame</Text>
      </View>
      <View className="flex-1 relative">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        {processing && (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4 font-bold">Processing...</Text>
          </View>
        )}
      </View>
      {scanned && !processing && (
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </SafeAreaView>
  );
}
