// src/screens/ConfirmarTokenScreen.js
import React, { useState } from 'react';
import { Alert, View, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {Text} from 'react-native';


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
        Alert.alert(t('global.success'), res.mensaje || t('toke.alerts.default_success'));
        dispatch(resetRegistroState());
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Error', err.mensaje || t('toke.alerts.default_error'));
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f6' }}>
      <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333', textAlign: 'center' }}>
          {t('token.verify_button')}
        </Text>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' }}>
          {t('token.instructions', { email })}
        </Text>
        <TextInput
          placeholder={t('token.placeholder')}
          value={token}
          onChangeText={setToken}
          maxLength={8}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            marginBottom: 20,
            padding: 12,
            fontSize: 18,
            backgroundColor: '#fafafa'
          }}
          keyboardType="numeric"
        />
        <Button title={t('token.submit_button')} onPress={enviarTokenConfirmacion} color="#1976d2" />
      </View>
    </View>
  );
};

export default ConfirmTokenRegisterScreen;
