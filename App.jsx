// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';

import './global.css';
import './src/i18n';
import { lightTheme, darkTheme } from "~/themes";

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
    },
  },
};

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
