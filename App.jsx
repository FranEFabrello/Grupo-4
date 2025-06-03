// App.js
import React, { useEffect } from "react";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from "react-redux";

import AppNavigator from './src/navigation/AppNavigator';
import store from '~/store';

import { guardarSuscripcionWebPush } from "~/store/slices/userSlice";

import './global.css';
import './src/i18n';
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "~/api/api";

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
