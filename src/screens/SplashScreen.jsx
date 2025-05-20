import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false });

  useEffect(() => {
    console.log('SplashScreen: Renderizando');

    const checkAuthAndNavigate = () => {
      setTimeout(() => {
        console.log('SplashScreen: Redirigiendo a Welcome');
        navigation.replace('Welcome');
      }, 2000);
    };

    checkAuthAndNavigate();

    return () => {
      console.log('SplashScreen: Limpiando');
    };
  }, [navigation, isAuthenticated]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Tu App</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

}