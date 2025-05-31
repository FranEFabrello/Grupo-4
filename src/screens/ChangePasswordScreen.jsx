import React, { useState } from 'react';
import { Alert, View, TextInput, Text, TouchableOpacity } from "react-native";
import { useDispatch } from 'react-redux';
import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';
import { solicitarCambioContrasenia, cambiarContrasenia } from '~/store/slices/userSlice';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = () => {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [token, setToken] = useState('');
  const [tokenValidado, setTokenValidado] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const cambiarContraseniaHandler = async () => {
    if (!correo) {
      Alert.alert(t('global.error'), t('change_password.email'));
      return;
    }
    try {
      await dispatch(solicitarCambioContrasenia({ correo })).unwrap();
      setSolicitudEnviada(true);
      setTokenValidado(false);
      Alert.alert(
        t('global.success'),
        t('send_email.alerts.email_sent'),
        [
          {
            text: t('global.button.accept'),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.mensaje || t('change_password.alerts.request_error'));
    }
  };

  const validarTokenHandler = async (token) => {
    try {
      console.log(t('token.verification_title'), { correo, token });
      const tokenIngresado = token;
      const resValidacion = await dispatch(
        validarTokenCambioContrasenia({ correo, tokenIngresado })
      ).unwrap();
      Alert.alert(t('global.success'), resValidacion.mensaje);
      setTokenValidado(true);
    } catch (err) {
      Alert.alert('Error', err.mensaje || t('token.alerts.default_error'));
    }
  };

  const guardarNuevaContrasenia = async () => {
    if (!nuevaContrasenia || !repetirContrasenia) {
      Alert.alert('Error', t('change_password.alerts.no_email_error'));
      return;
    }
    if (nuevaContrasenia !== repetirContrasenia) {
      Alert.alert('Error', t('change_password.alerts.emails_notMatch'));
      return;
    }
    try {
      await dispatch(cambiarContrasenia({ correo, nuevaContrasenia })).unwrap();
      Alert.alert(t('global.success'), t('token.alerts.success'));
    } catch (err) {
      Alert.alert('Error', err.mensaje || t('change_password.alerts.chage_error'));
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-gray-800">{t('change_password.title')}</Text>

      {!tokenValidado && (
        <>
          {!solicitudEnviada && (
            <>
              <TextInput
                className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
                placeholder="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={true}
              />
              <TouchableOpacity
                className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-3"
                onPress={async () => {
                  await cambiarContraseniaHandler();
                }}
              >
                <Text className="text-white text-base font-bold">{t('token.Request')}</Text>
              </TouchableOpacity>
            </>
          )}
          {solicitudEnviada && (
            <>
              <TextInput
                className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
                placeholder="Token recibido"
                value={token}
                onChangeText={setToken}
                keyboardType="default"
                autoCapitalize="none"
              />
              <TouchableOpacity
                className="w-full h-12 bg-blue-500 rounded-lg justify-center items-center mb-3"
                onPress={() => validarTokenHandler(token)}
              >
                <Text className="text-white text-base font-bold">{t('toke.verify_button')}</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {tokenValidado && (
        <>
          <TextInput
            className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
            placeholder="Nueva contraseña"
            value={nuevaContrasenia}
            onChangeText={setNuevaContrasenia}
            secureTextEntry={true}
          />
          <TextInput
            className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
            placeholder="Repetir nueva contraseña"
            value={repetirContrasenia}
            onChangeText={setRepetirContrasenia}
            secureTextEntry={true}
          />
          <TouchableOpacity
            className="w-full h-12 bg-green-600 rounded-lg justify-center items-center mb-3"
            onPress={guardarNuevaContrasenia}
          >
            <Text className="text-white text-base font-bold">{t('change_password.save_button')}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
export default ChangePasswordScreen;