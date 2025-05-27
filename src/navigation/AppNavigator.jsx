import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import LoginScreen from "~/screens/LoginScreen";
import RegisterScreen from "~/screens/RegisterScreen";
import WelcomeScreen from "~/screens/WelcomeScreen";
import SplashScreen from "~/screens/SplashScreen";
import ConfirmTokenRegisterScreen from "~/screens/ConfirmTokenRegisterScreen";
import ChangePasswordScreen from "~/screens/ChangePasswordScreen";
import HelpNeeded from "~/screens/HelpNeeded";
import SecurityPolicyScreen from "~/screens/SecurityPolicyScreen";
import NotificationsScreen from "~/screens/NotificationsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Professionals" component={ProfessionalsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ headerShown: true }} />
      <Stack.Screen name="MedicalNotes" component={MedicalNotesScreen} options={{ headerShown: true }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: true }} />
      <Stack.Screen name="HealthTips" component={HealthTipsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Help" component={HelpNeeded} options={{ headerShown: true }} />
        <Stack.Screen name="SecurityPolicy" component={SecurityPolicyScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
      <Stack.Screen name="ConfirmarToken" component={ConfirmTokenRegisterScreen} options={{ headerShown: true }} />
      <Stack.Screen name="CambioContrasenia" component={ChangePasswordScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}