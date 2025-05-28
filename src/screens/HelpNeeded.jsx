import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enviarMensajeAyuda } from "~/store/slices/userSlice";
import { Alert, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HelpNeeded() {
  const navigation = useNavigation();
  const [mensaje, setMensaje] = useState('');
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.user.usuario);
  const colorScheme = useColorScheme();

  const handleEnviar = () => {
    if (!mensaje.trim()) {
      Alert.alert('Por favor, escribe tu problema.');
      return;
    }
    dispatch(enviarMensajeAyuda({
      correoUsuario: usuario?.correo,
      mensaje
    }));
    setMensaje('');
  };

  const containerClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const textInputClass = colorScheme === 'light' ? 'border-gray-300 bg-white text-gray-800' : 'border-gray-600 bg-gray-700 text-gray-200';
  const buttonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const buttonTextClass = colorScheme === 'light' ? 'text-white' : 'text-gray-200';
  const placeholderTextColor = colorScheme === 'light' ? 'gray' : 'lightgray';

  return (
    <AppContainer navigation={navigation} screenTitle="Ayuda">
      <View className={`flex-1 justify-center items-center p-4 ${containerClass}`}>
        <TextInput
          className={`w-full max-w-[400px] border rounded-lg p-4 mb-6 min-h-[120px] text-base text-top ${textInputClass}`}
          placeholder="Describe tu problema aquí..."
          placeholderTextColor={placeholderTextColor}
          value={mensaje}
          onChangeText={setMensaje}
          multiline
          style={{ textAlignVertical: 'top' }}
        />
        <TouchableOpacity
          className={`py-2.5 px-6 rounded-lg ${buttonClass}`}
          activeOpacity={0.8}
          onPress={handleEnviar}
        >
          <Text className="text-white text-base">Enviar</Text>
        </TouchableOpacity>
      </View>
    </AppContainer>
  );
}
import AppContainer from "~/components/AppContainer";