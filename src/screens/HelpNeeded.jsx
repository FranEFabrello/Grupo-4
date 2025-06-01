import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enviarMensajeAyuda } from "~/store/slices/userSlice";
import { Alert, TextInput, TouchableOpacity, View, Text } from 'react-native';
import AppContainer from "~/components/AppContainer";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function HelpNeeded() {
  const navigation = useNavigation();
  const [mensaje, setMensaje] = useState('');
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.user.usuario);
  const { t } = useTranslation();

  const handleEnviar = () => {
    if (!mensaje.trim()) {
      Alert.alert(t('help.problem_description'));
      return;
    }
    dispatch(enviarMensajeAyuda({
      correoUsuario: usuario?.correo,
      mensaje
    }));
    setMensaje('');
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t("help.title")}>
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <TextInput
          className="w-full max-w-[400px] border border-gray-300 rounded-lg p-4 mb-6 min-h-[120px] text-base bg-white text-top"
          placeholder={t('help.problem_placeholder')}
          value={mensaje}
          onChangeText={setMensaje}
          multiline
          style={{ textAlignVertical: 'top' }}
        />
        <TouchableOpacity
          className="bg-blue-600 py-2.5 px-6 rounded-lg"
          activeOpacity={0.8}
          onPress={handleEnviar}
        >
          <Text className="text-white text-base">{t('global.button.send')}</Text>
        </TouchableOpacity>
      </View>
    </AppContainer>
  );
}