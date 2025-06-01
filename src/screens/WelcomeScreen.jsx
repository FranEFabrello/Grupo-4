import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <Text className="text-3xl font-bold mb-10 text-gray-800">{t('welcome.title')}</Text>

      <TouchableOpacity
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-white font-bold text-base">{t('welcome.login_button')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full h-12 bg-green-600 rounded-lg justify-center items-center"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-white font-bold text-base">{t('welcome.register_button')}</Text>
      </TouchableOpacity>
    </View>
  );
}
