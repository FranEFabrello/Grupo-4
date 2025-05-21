// src/screens/ConfirmarTokenScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';

const ConfirmTokenRegisterScreen = ({ route }) => {
  const [token, setToken] = useState('');
  const email = route.params?.email || '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  return (
    <View>
      <TextInput
        placeholder="Ingresar token"
        value={token}
        onChangeText={setToken}
        maxLength={8}
        style={{ borderWidth: 1, margin: 10, padding: 10 }}
      />
      <Button title="Confirmar token" onPress={enviarTokenConfirmacion} />
    </View>
  );
};

export default ConfirmTokenRegisterScreen;
