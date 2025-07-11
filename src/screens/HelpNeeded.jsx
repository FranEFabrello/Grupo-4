import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enviarMensajeAyuda } from "~/store/slices/userSlice";
import { Alert, TextInput, TouchableOpacity, View, Text } from 'react-native';
import AppContainer from "~/components/AppContainer";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function HelpNeeded() {
  const navigation = useNavigation();
  const [mensaje, setMensaje] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.user.usuario);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const inputBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderColor = colorScheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const selectedButtonText = 'text-white';

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
    setShowSuccessModal(true);
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t("help.title")}>
      <View className={`flex-1 justify-center items-center ${containerBg} p-5`}>
        <TextInput
          className={`w-full max-w-[400px] border ${borderColor} ${inputBg} rounded-xl p-4 mb-6 min-h-[120px] text-base ${primaryText}`}
          placeholder={t('help.problem_placeholder')}
          placeholderTextColor={colorScheme === 'light' ? '#6B7280' : '#9CA3AF'}
          value={mensaje}
          onChangeText={setMensaje}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          className={`${selectedButtonBg} py-3 px-4 rounded-xl`}
          activeOpacity={0.8}
          onPress={handleEnviar}
        >
          <Text className={`${selectedButtonText} text-base font-semibold`}>{t('global.button.send')}</Text>
        </TouchableOpacity>
      </View>
      {showSuccessModal && (
        <View className="absolute inset-0 bg-black bg-opacity-40 justify-center items-center z-50">
          <View className={`bg-white dark:bg-gray-800 rounded-xl p-8 w-80 items-center`}>
            <Text className="text-lg font-semibold mb-2">{t('helpScreen.title')}</Text>
            <Text className="text-base mb-6 text-center">{t('helpScreen.help_message_success')}</Text>
            <TouchableOpacity
              className={`${selectedButtonBg} py-2 px-6 rounded-xl`}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text className={`${selectedButtonText} text-base font-semibold`}>{t('helpScreen.button.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AppContainer>
  );
}