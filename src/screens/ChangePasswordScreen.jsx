// src/screens/CambioContraseniaScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button, useColorScheme, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';
import AppContainer from '../components/AppContainer'; // Assuming you have an AppContainer component

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
 const colorScheme = useColorScheme();

  return (
    <AppContainer>
      <View style={[styles.container, colorScheme === 'dark' && styles.darkContainer]}>
        <TextInput
          style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
          placeholder="Correo"
          placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={[styles.input, colorScheme === 'dark' && styles.darkInput]}
          placeholder="Nueva contraseña"
          placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
          value={nuevaContrasenia}
          onChangeText={setNuevaContrasenia}
          secureTextEntry
        />
        <Button title="Cambiar contraseña" onPress={cambiarContrasenia} color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'} />
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  darkContainer: { backgroundColor: '#1F2937' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, color: '#000' },
  darkInput: { borderColor: '#555', color: '#fff', backgroundColor: '#374151' },
});



export default ChangePasswordScreen;

/* Para cuando falte configurar la redireccion desde la pantalla del perfil
* dispatch(enviarSolicitudReset(correo))
  .unwrap()
  .then(() => {
    navigation.navigate("CodigoResetScreen", { correo });
  });

*
* */
