import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-3xl font-bold mb-10 text-gray-800">Bienvenido</Text>

      <TouchableOpacity
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white font-bold text-base">Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full h-12 bg-green-600 rounded-lg justify-center items-center"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-white font-bold text-base">Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}
