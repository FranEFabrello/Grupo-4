import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, StatusBar } from "react-native";
import api from '~/api/api';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, sendPushTokenToBackend, handleNotification, handleNotificationResponse } from '~/services/notifications';

import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';
import { setToken, loadStoredToken } from '~/store/slices/autheticationSlice';
import ToastProvider from '~/components/ToastProvider'; // Importa el nuevo componente

import './global.css';
import './src/i18n';

import CustomStatusBar from "~/components/CustomStatusBar";

import 'react-native-gesture-handler';
import { ThemeProvider } from '~/providers/ThemeProvider';


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
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        const token = await getToken();
        if (token) {
          const response = await api.get('/Auth/validate', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.isValid) {
            dispatch(setToken(token));
          } else {
            await removeToken();
          }
        }
      } catch (e) {
        console.error('Error al inicializar la app:', e);
        await removeToken();
      } finally {
        setIsReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    dispatch(loadStoredToken());
  }, [dispatch]);

  useEffect(() => {
    // Inicializar notificaciones
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        sendPushTokenToBackend(token);
      }
    });

    // Configurar listeners de notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(handleNotification);
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    // Limpiar listeners al desmontar
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <ToastProvider>
      <CustomStatusBar />
      <NavigationContainer linking={linking} onReady={onLayoutRootView}>
        <AppNavigator />
      </NavigationContainer>
    </ToastProvider>
  );
}

export default function App() {
  return (

    <Provider store={store}>
      <ThemeProvider>
      <SafeAreaProvider>
        <AppWrapper />
      </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}