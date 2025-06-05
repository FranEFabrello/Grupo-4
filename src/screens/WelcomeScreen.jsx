import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from "~/providers/ThemeProvider";

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();


  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#18181b' : '#f3f4f6',
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 40,
          color: colorScheme === 'dark' ? '#f3f4f6' : '#1f2937',
        }}
      >
        {t('welcome.title')}
      </Text>

      <TouchableOpacity
        style={{
          width: '100%',
          height: 48,
          backgroundColor: colorScheme === 'dark' ? '#1d4ed8' : '#2563eb',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {t('welcome.login_button')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: '100%',
          height: 48,
          backgroundColor: colorScheme === 'dark' ? '#15803d' : '#22c55e',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {t('welcome.register_button')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
