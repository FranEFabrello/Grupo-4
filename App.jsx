import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import api from '~/api/api'; // Asegúrate de que esta importación sea correcta

import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';
import { setToken } from '~/store/slices/authSlice';

import './global.css';
import './src/i18n';

SplashScreen.preventAutoHideAsync();

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Splash: 'splash',
      Welcome: 'welcome',
      Login: 'login',
      Register: 'register',
      Home: '',
      Appointments: 'appointments',
      Professionals: 'professionals',
      BookAppointment: 'book-appointment',
      Results: 'results',
      Insurance: 'insurance',
      MedicalNotes: 'medical-notes',
      Profile: 'profile',
      UserProfile: 'user-profile',
      HealthTips: 'health-tips',
      Help: 'help',
      SecurityPolicy: 'security-policy',
      Notifications: 'notifications',
      ConfirmarToken: 'confirmar-token',
      CambioContrasenia: 'cambio-contrasenia',
      AppointmentDetail: 'appointment-detail',
    },
  },
};

// Función auxiliar para leer el token
const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('userToken');
    } else {
      return await SecureStore.getItemAsync('userToken');
    }
  } catch (e) {
    console.error('Error al leer el token:', e);
    return null;
  }
};

// Función auxiliar para eliminar el token
const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('userToken');
    } else {
      await SecureStore.deleteItemAsync('userToken');
    }
  } catch (e) {
    console.error('Error al eliminar el token:', e);
  }
};

function AppWrapper() {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const token = await getToken();
        if (token) {
          // Validar el token con el backend
          const response = await api.get('/Auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.isValid) {
            dispatch(setToken(token));
          } else {
            await removeToken(); // Eliminar token inválido
          }
        }
      } catch (e) {
        console.error('Error al inicializar la app:', e);
        await removeToken(); // Eliminar token en caso de error
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <NavigationContainer linking={linking} onReady={onLayoutRootView}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppWrapper />
      </SafeAreaProvider>
    </Provider>
  );
}