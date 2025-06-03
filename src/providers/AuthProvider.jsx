import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from '~/navigation/AppNavigator';
import { login, logout } from '~/store/slices/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

export default function AuthProvider() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('bearerToken');
        const userJson = await AsyncStorage.getItem('userData');
        if (token && userJson) {
          const user = JSON.parse(userJson);
          dispatch(login(user)); // Setea en Redux
        } else {
          dispatch(logout());
        }
      } catch (e) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
