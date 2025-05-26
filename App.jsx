// App.js
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';
import "./global.css";

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
  console.log('App: Renderizando, iniciando con Splash');
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


/*linking={linking}
          fallback={<Text style={{ color: 'red' }}>Cargando... Error de navegación</Text>}
          onReady={() => console.log('NavigationContainer: Listo, debería mostrar Splash')}*/

/*// App.js
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import AppNavigator from '~/navigation/AppNavigator';
import store from '~/store';
import "./global.css";

import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'styled-components/native';
import i18n from './i18n';
import { useColorScheme } from 'react-native'

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
  console.log('App: Renderizando, iniciando con Splash');
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </Provider>
      </ThemeProvider>
    </I18nextProvider>
  );
}*/