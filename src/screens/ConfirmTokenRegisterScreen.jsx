// src/screens/ConfirmarTokenScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const ConfirmTokenRegisterScreen = ({ route }) => {
  const [token, setToken] = useState('');
  const email = route.params?.email || '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tokenState = useSelector((state) => state.tokens);
  const { t } = useTranslation();

  const enviarTokenConfirmacion = () => {
    if (!token || token.length !== 8) {
      Alert.alert('Error', t('token.alerts.token_length_error') );
      return;
    }

    dispatch(validarTokenRegistro({ correo: email, tokenIngresado: token }))
      .unwrap()
      .then((res) => {
        Alert.alert(t('globa.success'), res.mensaje || t('toke.alerts.default_success'));
        dispatch(resetRegistroState());
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Error', err.mensaje || t('toke.alerts.default_error'));
      });
  };

  return (
    <View>
      <TextInput
        placeholder={t('token.placeholder')}
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
