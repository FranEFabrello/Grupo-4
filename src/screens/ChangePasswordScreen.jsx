// src/screens/CambioContraseniaScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';

const ChangePasswordScreen = () => {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const dispatch = useDispatch();

  const cambiarContrasenia = () => {
    if (!correo || !nuevaContrasenia) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    dispatch(validarTokenCambioContrasenia({ correo, nuevaContrasenia }))
      .unwrap()
      .then((res) => Alert.alert('Éxito', res.mensaje))
      .catch((err) => Alert.alert('Error', err.mensaje));
  };

  return (
    <View>
      <TextInput placeholder="Correo" value={correo} onChangeText={setCorreo} />
      <TextInput placeholder="Nueva contraseña" value={nuevaContrasenia} onChangeText={setNuevaContrasenia} secureTextEntry />
      <Button title="Cambiar contraseña" onPress={cambiarContrasenia} />
    </View>
  );
};

export default ChangePasswordScreen;

/* Para cuando falte configurar la redireccion desde la pantalla del perfil
* dispatch(enviarSolicitudReset(correo))
  .unwrap()
  .then(() => {
    navigation.navigate("CodigoResetScreen", { correo });
  });

*
* */
