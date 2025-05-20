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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Professionals" component={ProfessionalsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MedicalNotes" component={MedicalNotesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HealthTips" component={HealthTipsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}