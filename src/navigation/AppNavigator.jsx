import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfessionalsScreen from '../screens/ProfessionalsScreen';
import BookAppointmentScreen from '../screens/BookAppointmentScreen';
import ResultsScreen from '../screens/ResultsScreen';
import InsuranceScreen from '../screens/InsuranceScreen';
import MedicalNotesScreen from '../screens/MedicalNotesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HealthTipsScreen from '../screens/HealthTipsScreen';
import LoginScreen from '~/screens/LoginScreen';
import RegisterScreen from '~/screens/RegisterScreen';
import WelcomeScreen from '~/screens/WelcomeScreen';
import SplashScreen from '~/screens/SplashScreen';
import ConfirmTokenRegisterScreen from '~/screens/ConfirmTokenRegisterScreen';
import ChangePasswordScreen from '~/screens/ChangePasswordScreen';
import HelpNeeded from '~/screens/HelpNeeded';
import SecurityPolicyScreen from '~/screens/SecurityPolicyScreen';
import NotificationsScreen from '~/screens/NotificationsScreen';
import AppointmentDetailScreen from '~/screens/AppointmentDetailScreen';
import DoctorProfileScreen from "~/screens/DoctorProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false });

    return (
      <Stack.Navigator initialRouteName="Splash">
          {/* Pantalla de carga inicial */}
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

          {isAuthenticated ? (
            <>
                {/* Pantallas protegidas */}
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Professionals" component={ProfessionalsScreen} options={{ headerShown: false }} />
              <Stack.Screen
                name="BookAppointment"
                component={BookAppointmentScreen}
                options={{ headerShown: false, unmountOnBlur: true }}
              />
                <Stack.Screen name="Results" component={ResultsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MedicalNotes" component={MedicalNotesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="HealthTips" component={HealthTipsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SecurityPolicy" component={SecurityPolicyScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Help" component={HelpNeeded} options={{ headerShown: false }} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ConfirmarToken" component={ConfirmTokenRegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="CambioContrasenia" component={ChangePasswordScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DoctorProfileScreen" component={DoctorProfileScreen} options={{ headerShown: false }} />
            </>
          ) : (
            <>
                {/* Pantallas públicas */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ConfirmarToken" component={ConfirmTokenRegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CambioContrasenia" component={ChangePasswordScreen} options={{ headerShown: false }} />

            </>
          )}
      </Stack.Navigator>
    );
}