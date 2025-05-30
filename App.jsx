// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';

import './global.css';
import './src/i18n';

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
      AppointmentDetail: 'appointment-detail'
    },
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
