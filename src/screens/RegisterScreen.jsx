import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  const handleRegister = () => {
    console.log('Registrando:', nombre, apellido, email, contrasenia);
    navigation.replace('Home'); // o Login si querés que inicie sesión después
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-gray-800">Crear Cuenta</Text>

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white"
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white"
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white"
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white"
        placeholder="Contraseña"
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry
      />

      <TouchableOpacity
        className="w-full h-12 bg-green-600 rounded-lg justify-center items-center mt-2"
        onPress={handleRegister}
      >
        <Text className="text-white font-bold text-base">Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}
