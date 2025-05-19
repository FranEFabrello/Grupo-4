import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';

import "./global.css";

// Configuración de linking para reflejar las pantallas en la URL
const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
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
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer linking={linking} fallback={<Text style={{ color: 'red' }}>Cargando... Error de navegación</Text>}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}