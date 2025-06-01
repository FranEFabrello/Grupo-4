import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { authenticate } from "~/store/slices/autheticationSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handleLogin = () => {
    Keyboard.dismiss();
    console.log('Intentando iniciar sesión con:', email, password);
    dispatch(authenticate({ email, password }))
      .unwrap()
      .then(() => {
        navigation.navigate('Home');
      })
      .catch((error) => {
        // Manejar error de autenticación
        console.log('Error de autenticación:', error);
      });
  };

  const handleRegister = () => {
    // Navegar a la pantalla de registro
    Keyboard.dismiss();
    navigation.navigate('Register');
  };

  const handlePaswordChange = () => {
    // Navegar a la pantalla de cambiar contrasenia
    Keyboard.dismiss();
    navigation.navigate('CambioContrasenia');
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-gray-800">{t('login.title')}</Text>

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder={t('login.email_placeholder')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder={t('login.password_placeholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-3"
        onPress={handleLogin}
      >
        <Text className="text-white text-base font-bold">{t('login.submit_button')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text className="text-blue-600 text-sm mt-2">{t('login.register_prompt')}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePaswordChange}>
        <Text className="text-blue-600 text-sm mt-2">{t('login.forgot_password')}</Text>
      </TouchableOpacity>
    </View>
  );
}