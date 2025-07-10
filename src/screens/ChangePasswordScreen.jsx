import React, { useState } from 'react';
import { Alert, View, TextInput, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch } from 'react-redux';
import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';
import { solicitarCambioContrasenia, cambiarContrasenia } from '~/store/slices/userSlice';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

const ChangePasswordScreen = ({navigation}) => {
  const [correo, setCorreo] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [token, setToken] = useState('');
  const [tokenValidado, setTokenValidado] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const isDark = colorScheme === 'dark';
  const [mostrarError, setMostrarError] = useState(false);

  const [loading, setLoading] = useState(false);

  const cambiarContraseniaHandler = async () => {
    if (!correo) {
      Alert.alert(t('global.error'), t('change_password.email'));
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(solicitarCambioContrasenia({ correo })).unwrap();
      setSolicitudEnviada(true);
      setTokenValidado(false);
      Alert.alert(
        t('global.alert.success'),
        t('send_email.alerts.email_sent'),
        [
          {
            text: t('send_email.send'),
          },
        ]
      );
    } catch (err) {
      setSolicitudEnviada(false);
      Alert.alert('Error', err.mensaje || t('change_password.alerts.request_error'));
    } finally {
      setLoading(false);
    }
  };

  const validarTokenHandler = async (token) => {
    try {
      setLoading(true);
      //console.log(t('token.verification_title'), { correo, token });
      const tokenIngresado = token;
      const resValidacion = await dispatch(
        validarTokenCambioContrasenia({ correo, tokenIngresado })
      ).unwrap();
      Alert.alert(t('global.alert.success'), resValidacion.mensaje);
      setTokenValidado(true);
    } catch (err) {
      Alert.alert('Error', err.mensaje || t('token.alerts.default_error'));
    } finally {
      setLoading(false);
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
      className={`flex-1 justify-center items-center px-6 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
    >
      <View
        className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-opacity-90"
        style={{ backgroundColor: isDark ? '#1f2937' : 'white' }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            color: isDark ? '#f3f4f6' : '#333',
            textAlign: 'center',
          }}
        >
          {t('change_password.title')}
        </Text>

        {/* Overlay de transición */}
                {loading && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: isDark ? 'rgba(24,24,27,0.85)' : 'rgba(0,0,0,0.5)',
                      zIndex: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 16,
                    }}
                    pointerEvents="auto"
                  >
                    <ActivityIndicator size="large" color="#fff" />
                  </View>
                )}

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
                backgroundColor: isDark ? '#2563eb' : '#1976d2',
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
    </View>
  );
};
export default ChangePasswordScreen;