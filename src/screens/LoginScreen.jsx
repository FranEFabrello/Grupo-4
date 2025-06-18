// LoginScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Platform, // Agrega esta importación
} from 'react-native';
import { useDispatch } from 'react-redux';
import { authenticate } from '~/store/slices/autheticationSlice';
import { useTranslation } from 'react-i18next';
import LoginLoadingOverlay from "~/components/LoginLoadingOverlay";
import { useAppTheme } from "~/providers/ThemeProvider";
import { actualizarFcmToken, fetchUserByToken } from "~/store/slices/userSlice";
import { registerForPushNotificationsAsync } from "~/api/registerForPushNotificationsAsync";
import { fetchProfessionals } from "~/store/slices/professionalsSlice";
import { fetchAppointments } from "~/store/slices/appointmentsSlice";
import { fetchNotificaciones } from "~/store/slices/notificationSlice";
import { fetchSpecialities } from "~/store/slices/medicalSpecialitiesSlice";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const containerClass = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const inputClass = isDark
    ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600'
    : 'bg-white text-black placeholder-gray-500 border-gray-300';
  const textColor = isDark ? 'text-white' : 'text-gray-800';

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);

      // 1. Autenticamos al usuario
      console.log('Intentando autenticar al usuario con email:', email, 'y contraseña:', password);
      const user = await dispatch(authenticate({ email, password })).unwrap();
      console.log('Usuario autenticado:', user);

      // 2. Obtenemos el token de notificaciones solo en plataformas móviles
      let token = null;
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        token = await registerForPushNotificationsAsync();
        console.log('Token de notificaciones: !!!', token);
        if (!token) {
          console.log('No se pudo obtener el token de notificaciones');
        } else {
          console.log('Token de notificaciones obtenido:', token);
        }
      } else {
        console.log('Notificaciones push omitidas en la plataforma web');
      }

      // 3. Obtenemos los datos del usuario
      const usuario = await dispatch(fetchUserByToken()).unwrap();
      if (!usuario || !usuario.id) {
        console.log('No se pudo obtener la información del usuario');
        return;
      }
      console.log('Datos del usuario obtenidos:', usuario);

      // 4. Actualizamos el token FCM solo si se obtuvo un token
      if (token) {
        await dispatch(actualizarFcmToken({
          id: usuario.id,
          token: token.data ?? token
        })).unwrap();
        console.log('Token FCM actualizado exitosamente');
      } else {
        console.log('No se actualizó el token FCM porque no se obtuvo un token');
      }

      // 5. Ejecutamos las peticiones iniciales
      await Promise.all([
        dispatch(fetchProfessionals()).unwrap(),
        dispatch(fetchAppointments(usuario.id)).unwrap(),
        dispatch(fetchNotificaciones(usuario.id)).unwrap(),
        dispatch(fetchSpecialities()).unwrap(),
      ]);
      console.log('Datos iniciales cargados con éxito');

      // 6. Navegamos a Home
      navigation.navigate('Home');

    } catch (error) {
      console.error('Error en el proceso de login:', error);
      // Mostrar un toast o modal aquí si es necesario
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    navigation.navigate('Register');
  };

  const handlePaswordChange = () => {
    Keyboard.dismiss();
    navigation.navigate('CambioContrasenia');
  };

  return (
    <View className={`flex-1 justify-center items-center px-6 ${containerClass}`}>
      <View
        className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-opacity-90"
        style={{ backgroundColor: isDark ? '#1f2937' : 'white' }}
      >
        <Text className={`text-3xl font-extrabold mb-6 text-center ${textColor}`}>
          {t('login.title')}
        </Text>

        <TextInput
          className={`w-full h-12 rounded-xl px-4 mb-4 border ${inputClass}`}
          placeholder={t('login.email_placeholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          className={`w-full h-12 rounded-xl px-4 mb-4 border ${inputClass}`}
          placeholder={t('login.password_placeholder')}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity
          className={`w-full h-12 rounded-xl justify-center items-center mb-4 shadow-md ${
            isLoading ? 'bg-blue-400 opacity-80' : 'bg-blue-600'
          }`}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              {t('login.submit_button')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
          <Text className="text-blue-500 text-sm text-center mt-2">
            {t('login.register_prompt')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePaswordChange} disabled={isLoading}>
          <Text className="text-blue-400 text-sm text-center mt-2">
            {t('login.forgot_password')}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && <LoginLoadingOverlay />}
    </View>
  );
}