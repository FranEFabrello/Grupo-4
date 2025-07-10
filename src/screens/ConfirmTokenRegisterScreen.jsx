// src/screens/ConfirmarTokenScreen.js
import { useDispatch, useSelector } from 'react-redux';
import { validarTokenRegistro, resetRegistroState } from "~/store/slices/tokenSlice";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useAppTheme } from "~/providers/ThemeProvider";
import { twMerge } from "tailwind-merge";
import LoadingOverlay from '~/components/LoadingOverlay';   // ⬅️ importa el overlay


const ConfirmTokenRegisterScreen = ({ route }) => {
  const [token, setToken] = useState('');
  const email = route.params?.email || '';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tokenState = useSelector((state) => state.tokens);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(false);          // ⬅️ nuevo estado
  const MAX_LENGTH = 8;                                       // ⬅️ longitud máxima

  const enviarTokenConfirmacion = () => {
    if (token.length !== MAX_LENGTH) {
      // Sólo avisamos si se intenta enviar con longitud incorrecta
      Alert.alert('Error', t('token.alerts.token_length_error'));
      return;
    }

    setIsLoading(true);                                       // ⬅️ empieza carga
    dispatch(validarTokenRegistro({ correo: email, tokenIngresado: token }))
      .unwrap()
      .then((res) => {
        Alert.alert(t('global.alert.success'), res.mensaje || t('token.alerts.default_success'));
        dispatch(resetRegistroState());
        navigation.replace('Login');
      })
      .catch((err) => {
        Alert.alert('Error', err.mensaje || t('token.alerts.token_length_error'));
      })
      .finally(() => setIsLoading(false));                    // ⬅️ termina carga
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
          maxLength={MAX_LENGTH}
          keyboardType="numeric"
          placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
          className={twMerge(
            "border rounded-lg mb-5 px-4 py-3 text-lg",
            isDark
              ? "border-zinc-600 bg-zinc-900 text-zinc-100"
              : "border-zinc-300 bg-zinc-100 text-zinc-900"
          )}
        />

        {/* Aviso de caracteres restantes solo después de intentar enviar */}
        {token.length < MAX_LENGTH && isLoading && (
          <Text className={twMerge(
            "mb-4 text-sm",
            isDark ? "text-rose-300" : "text-rose-600"
          )}>
            {t('token.alerts.missing_token', { remaining: MAX_LENGTH - token.length })}
          </Text>
        )}

        {/* Botón estilo LoginScreen */}
        <TouchableOpacity
          disabled={isLoading}
          onPress={enviarTokenConfirmacion}
          activeOpacity={0.8}
          className={twMerge(
            "h-12 rounded-xl justify-center items-center shadow-md",
            isLoading
              ? "bg-blue-400 opacity-80"
              : "bg-blue-600"
          )}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white font-semibold">{t('token.submit_button')}</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Overlay de carga */}
      {isLoading && <LoadingOverlay />}
    </View>
  );
};

export default ConfirmTokenRegisterScreen;