import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { authenticate, fetchUserByToken, actualizarFcmToken } from '~/store/slices/autheticationSlice';
import { useTranslation } from 'react-i18next';
import LoadingOverlay from "~/components/LoadingOverlay";
import { useAppTheme } from "~/providers/ThemeProvider";
import { registerForPushNotificationsAsync } from "~/utils/PushNotifications";

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

      // Primero autenticamos al usuario
      const user = await dispatch(authenticate({ email, password })).unwrap();
      console.log('Usuario autenticado:', user);

      // Navegamos a Home
      navigation.navigate('Home');

      // Obtenemos el token de notificaciones
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        console.log('No se pudo obtener el token de notificaciones');
        return;
      }
      console.log('Token de notificaciones obtenido:', token);

      // Obtenemos los datos del usuario
      const usuario = await dispatch(fetchUserByToken()).unwrap();
      if (!usuario || !usuario.id) {
        console.log('No se pudo obtener la información del usuario');
        return;
      }
      console.log('Datos del usuario obtenidos:', usuario);

      // Actualizamos el token FCM
      await dispatch(actualizarFcmToken({ 
        id: usuario.id, 
        token: token.data // Aseguramos que enviamos el token.data
      })).unwrap();
      console.log('Token FCM actualizado exitosamente');

    } catch (error) {
      console.error('Error en el proceso de login:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
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
        <Text className={`text-3xl font-extrabold mb-6 ${textColor}`}>
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


      {isLoading &&
        <LoadingOverlay />}
    </View>
  );
}
