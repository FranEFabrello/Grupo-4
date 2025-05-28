// src/screens/ConfirmarTokenScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';

const ConfirmTokenRegisterScreen = ({ route }) => {
  const [token, setToken] = useState('');
  const email = route.params?.email || '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const tokenState = useSelector((state) => state.tokens);

  const enviarTokenConfirmacion = () => {
    if (!token || token.length !== 8) {
      Alert.alert('Error', 'El token debe tener 8 caracteres.');
      return;
    }

    dispatch(validarTokenRegistro({ correo: email, tokenIngresado: token }))
      .unwrap()
      .then((res) => {
        Alert.alert('Éxito', res.mensaje || 'Token validado correctamente');
        dispatch(resetRegistroState());
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Error', err.mensaje || 'Token inválido');
      });
  };

  const containerStyle = colorScheme === 'dark' ? { flex: 1, backgroundColor: '#1f2937', padding: 20 } : { flex: 1, backgroundColor: '#ffffff', padding: 20 };
  const inputStyle = colorScheme === 'dark' ? { borderWidth: 1, borderColor: '#4b5563', margin: 10, padding: 10, color: '#d1d5db', backgroundColor: '#374151' } : { borderWidth: 1, borderColor: '#d1d5db', margin: 10, padding: 10, color: '#1f2937', backgroundColor: '#ffffff' };

  // Button component on React Native does not directly support styling text color based on theme easily,
  // The color prop controls the button color itself on iOS and text color on Android.
  // For consistent look, you might consider using TouchableOpacity with Text.
  // For simplicity, we'll just set the button color.
  const buttonColor = colorScheme === 'dark' ? '#60a5fa' : '#3b82f6';

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder="Ingresar token"
        placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
        value={token}
        onChangeText={setToken}
        maxLength={8}
        style={inputStyle}
      />
      <Button
        title="Confirmar token"
        onPress={enviarTokenConfirmacion}
        color={buttonColor}
      />
    </View>
  );
};

export default ConfirmTokenRegisterScreen;
