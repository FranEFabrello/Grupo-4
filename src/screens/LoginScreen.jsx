import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
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
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const [showPassword, setShowPassword] = useState(false);

  const containerClass = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const inputClass = isDark
    ? 'bg-gray-800 text-white placeholder-gray-400 border-gray-600'
    : 'bg-white text-black placeholder-gray-500 border-gray-300';
  const textColor = isDark ? 'text-white' : 'text-gray-800';
  const loginBtnClass = isDark ? 'bg-blue-700' : 'bg-blue-600';
  const registerBtnClass = isDark ? 'bg-blue-900' : 'bg-blue-800';
  const cardBgClass = isDark ? 'bg-gray-800' : 'bg-white';

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);

      // 1. Autenticamos al usuario
      const user = await dispatch(authenticate({ email, password })).unwrap();

      // 2. Obtenemos el token de notificaciones solo en plataformas móviles
      let token = null;
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        token = await registerForPushNotificationsAsync();
      }

      // 3. Obtenemos los datos del usuario
      const usuario = await dispatch(fetchUserByToken()).unwrap();
      if (!usuario || !usuario.id) {
        throw new Error('Usuario inválido');
      }

      // 4. Actualizamos el token FCM solo si se obtuvo un token
      if (token) {
        await dispatch(actualizarFcmToken({
          id: usuario.id,
          token: token.data ?? token
        })).unwrap();
      }

      // 5. Ejecutamos las peticiones iniciales
      await Promise.all([
        dispatch(fetchProfessionals()).unwrap(),
        dispatch(fetchAppointments(usuario.id)).unwrap(),
        dispatch(fetchNotificaciones(usuario.id)).unwrap(),
        dispatch(fetchSpecialities()).unwrap(),
      ]);

      // 6. Navegamos a Home solo si todo salió bien
      navigation.navigate('Home');

    } catch (error) {
      if (error?.status === 404 || error?.status === 403) {
        setShowErrorModal(true);
      }
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

  // Acciones del modal
  const handleRetry = () => {
    setShowErrorModal(false);
    // Puedes limpiar campos o reintentar login si lo deseas
  };

  const handleLoginAgain = () => {
    setShowErrorModal(false);
    setEmail('');
    setPassword('');
    // Redirige a Welcome y resetea el stack de navegación
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <View className={`flex-1 justify-center items-center px-6 ${containerClass}`}>
      {/* Modal de error de autenticación/conexión */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 max-w-md rounded-2xl p-6 ${cardBgClass} shadow-2xl`}>
            <Text className={`text-xl font-bold mb-4 text-center ${textColor}`}>
              {t('welcome.error_title', 'Error de autenticación o conexión')}
            </Text>
            <Text className={`mb-6 text-center ${textColor}`}>
              {t('welcome.error_message', 'No se pudo conectar con el servidor o hubo un error de autenticación.')}
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`flex-1 mr-2 h-12 rounded-xl justify-center items-center ${loginBtnClass}`}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">
                  {t('welcome.retry_button', 'Reintentar conexión')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 ml-2 h-12 rounded-xl justify-center items-center ${registerBtnClass}`}
                onPress={handleLoginAgain}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold">
                  {t('welcome.login_again_button', 'Volver a ingresar')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

        <View className={`w-full h-12 rounded-xl px-4 mb-4 border ${inputClass} flex-row items-center relative`}>
          <TextInput
            className={`flex-1 h-full bg-transparent ${isDark ? 'text-white placeholder-gray-400' : 'text-black placeholder-gray-500'}`}
            placeholder={t('login.password_placeholder')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
            style={{ paddingRight: 40 }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 10,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
            }}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={24}
              color={isDark ? '#fff' : '#374151'}
            />
          </TouchableOpacity>
        </View>

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