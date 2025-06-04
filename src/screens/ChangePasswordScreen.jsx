import React, { useState } from 'react';
import { Alert, View, TextInput, Text, TouchableOpacity } from "react-native";
import { useDispatch } from 'react-redux';
import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';
import { solicitarCambioContrasenia, cambiarContrasenia } from '~/store/slices/userSlice';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

const ChangePasswordScreen = ({navigation}) => {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [token, setToken] = useState('');
  const [tokenValidado, setTokenValidado] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [mostrarError, setMostrarError] = useState(false);

  const cambiarContraseniaHandler = async () => {
    console.log('token.verification_title', { correo });
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
            text: t('send_email.send'),
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
    setMostrarError(false);
    if (!nuevaContrasenia || !repetirContrasenia) {
      Alert.alert('Error', t('change_password.alerts.no_email_error'));
      return;
    }
    if (nuevaContrasenia !== repetirContrasenia) {
      setMostrarError(true);
      Alert.alert('Error', t('change_password.alerts.emails_notMatch'));
      return;
    }
    try {
      await dispatch(cambiarContrasenia({ correo, nuevaContrasenia })).unwrap();
      navigation.navigate('Welcome');
    } catch (err) {
      Alert.alert('Error', err.mensaje || t('change_password.alerts.chage_error'));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: isDark ? '#18181b' : '#f6f6f6',
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: isDark ? '#f3f4f6' : '#333',
        }}
      >
        {t('change_password.title')}
      </Text>

      {!tokenValidado && (
        <>
          {!solicitudEnviada && (
            <>
              <TextInput
                style={{
                  width: '100%',
                  height: 48,
                  borderWidth: 1,
                  borderColor: isDark ? '#52525b' : '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                  backgroundColor: isDark ? '#27272a' : '#fff',
                  color: isDark ? '#f3f4f6' : '#18181b',
                }}
                placeholder="Correo electrónico"
                placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={true}
              />
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 48,
                  backgroundColor: isDark ? '#2563eb' : '#1976d2',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
                onPress={() => {
                  cambiarContraseniaHandler();
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  {t('token.request')}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {solicitudEnviada && (
            <>
              <TextInput
                style={{
                  width: '100%',
                  height: 48,
                  borderWidth: 1,
                  borderColor: isDark ? '#52525b' : '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  marginBottom: 16,
                  backgroundColor: isDark ? '#27272a' : '#fff',
                  color: isDark ? '#f3f4f6' : '#18181b',
                }}
                placeholder={t('token.alerts.token_received')}
                placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
                value={token}
                onChangeText={setToken}
                keyboardType="default"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 48,
                  backgroundColor: isDark ? '#2563eb' : '#1976d2',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
                onPress={() => validarTokenHandler(token)}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  {t('token.verify_button')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}

      {tokenValidado && (
        <>
          <TextInput
            style={{
              width: '100%',
              height: 48,
              borderWidth: 1,
              borderColor: isDark ? '#52525b' : '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              marginBottom: 16,
              backgroundColor: isDark ? '#27272a' : '#fff',
              color: isDark ? '#f3f4f6' : '#18181b',
            }}
            placeholder={t('change_password.new_password_placeholder')}
            placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
            value={nuevaContrasenia}
            onChangeText={setNuevaContrasenia}
            secureTextEntry={true}
          />
          <TextInput
            style={{
              width: '100%',
              height: 48,
              borderWidth: 1,
              borderColor: isDark ? '#52525b' : '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              marginBottom: 16,
              backgroundColor: isDark ? '#27272a' : '#fff',
              color: isDark ? '#f3f4f6' : '#18181b',
            }}
            placeholder={t('change_password.repeat_password_placeholder')}
            placeholderTextColor={isDark ? '#71717a' : '#9ca3af'}
            value={repetirContrasenia}
            onChangeText={setRepetirContrasenia}
            secureTextEntry={true}
          />
          {mostrarError && (
            <Text
              style={{
                color: isDark ? '#f87171' : 'red',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              {t('change_password.passwords_not_match')}
            </Text>
          )}
          <TouchableOpacity
            style={{
              width: '100%',
              height: 48,
              backgroundColor: isDark ? '#22c55e' : '#16a34a',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
            onPress={guardarNuevaContrasenia}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {t('change_password.save_button')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
export default ChangePasswordScreen;