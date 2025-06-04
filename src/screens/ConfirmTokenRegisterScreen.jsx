// src/screens/ConfirmarTokenScreen.js
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, Button, Alert, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-variants';

const ConfirmTokenRegisterScreen = ({ route }) => {
  const [token, setToken] = useState('');
  const email = route.params?.email || '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tokenState = useSelector((state) => state.tokens);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const enviarTokenConfirmacion = () => {
    if (!token || token.length !== 8) {
      Alert.alert('Error', t('token.alerts.token_length_error'));
      return;
    }

    dispatch(validarTokenRegistro({ correo: email, tokenIngresado: token }))
      .unwrap()
      .then((res) => {
        Alert.alert(t('global.success'), res.mensaje || t('token.alerts.default_success'));
        dispatch(resetRegistroState());
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Error', err.mensaje || t('token.alerts.default_error'));
      });
  };

  return (
    <View className={twMerge("flex-1 justify-center items-center", isDark ? "bg-zinc-900" : "bg-zinc-100")}>
      <View className={twMerge(
        "w-11/12 rounded-xl p-6 shadow-md",
        isDark ? "bg-zinc-800" : "bg-white"
      )}>
        <Text className={twMerge(
          "text-center text-2xl font-bold mb-4",
          isDark ? "text-zinc-100" : "text-zinc-800"
        )}>
          {t('token.verify_button')}
        </Text>
        <Text className={twMerge(
          "text-center text-base mb-6",
          isDark ? "text-zinc-400" : "text-zinc-600"
        )}>
          {t('token.instructions', { email })}
        </Text>
        <TextInput
          placeholder={t('token.placeholder')}
          value={token}
          onChangeText={setToken}
          maxLength={8}
          keyboardType="numeric"
          placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
          className={twMerge(
            "border rounded-lg mb-5 px-4 py-3 text-lg",
            isDark
              ? "border-zinc-600 bg-zinc-900 text-zinc-100"
              : "border-zinc-300 bg-zinc-100 text-zinc-900"
          )}
        />
        <Button
          title={t('token.submit_button')}
          onPress={enviarTokenConfirmacion}
          color={isDark ? '#2563eb' : '#1976d2'}
        />
      </View>
    </View>
  );
};

export default ConfirmTokenRegisterScreen;
