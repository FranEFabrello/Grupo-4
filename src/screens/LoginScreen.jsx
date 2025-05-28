import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, useColorScheme } from "react-native";
import { authenticate } from "~/store/slices/authSlice";
import { useDispatch } from "react-redux";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const colorScheme = useColorScheme(); // Detecta el tema del sistema

  const containerClass = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const inputClass = colorScheme === 'light' ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-gray-200';
  const buttonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';

  const handleLogin = () => {
    Keyboard.dismiss();
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

  return (
    <View className={`flex-1 justify-center items-center p-5 ${containerClass}`}>
      <Text className={`text-2xl font-bold mb-5 ${textClass}`}>Iniciar Sesión</Text>

      <TextInput
        className={`w-full h-12 border rounded-lg px-3 mb-4 ${inputClass}`}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Asegurar minúsculas en email
        autoCapitalize="none"
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword} // Cambiado de className a style
        secureTextEntry
      />

      <TouchableOpacity
        className={`w-full h-12 ${buttonClass} rounded-lg justify-center items-center mb-3`}
        onPress={handleLogin}
      >
        <Text className="text-white text-base font-bold">Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRegister}>
        <Text className={`${linkClass} text-sm mt-2`}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

