import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import AppContainer from '~/components/AppContainer';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function SecurityPolicyScreen({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const sectionBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const accentText = colorScheme === 'light' ? 'text-blue-700' : 'text-blue-400';

  return (
    <AppContainer navigation={navigation} screenTitle={t('policy.title')}>
      <ScrollView className={`flex-1 ${containerBg} p-5`}>
        <View className={`${sectionBg} rounded-xl shadow-sm p-5 mb-4`}>
          <Text className={`text-2xl font-bold ${accentText} mb-2`}>{t('policy.title')}</Text>
          <Text className={`text-base ${secondaryText} mb-4`}>
            {t('policy.sub_1')}
          </Text>
        </View>

        <View className={`${sectionBg} rounded-xl shadow-sm p-5 mb-4`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-2`}>{t('policy.how.title')}</Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.how.sub_1')}
          </Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.how.sub_2')}
          </Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.how.sub_3')}
          </Text>
        </View>

        <View className={`${sectionBg} rounded-xl shadow-sm p-5 mb-4`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-2`}>{t('policy.rights.title')}</Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.rights.sub_1')}
          </Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.rights.sub_2')}
          </Text>
        </View>

        <View className={`${sectionBg} rounded-xl shadow-sm p-5 mb-4`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-2`}>{t('policy.tips.title')}</Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.tips.sub_1')}
          </Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.tips.sub_2')}
          </Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.tips.sub_3')}
          </Text>
        </View>

        <View className={`${sectionBg} rounded-xl shadow-sm p-5`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-2`}>{t('policy.contact.title')}</Text>
          <Text className={`text-base ${secondaryText} mb-2`}>
            {t('policy.contact.email')}
            <Text
              className={`${accentText} underline`}
              onPress={() => Linking.openURL('mailto:soporte@app.com')}
            >
              soporte@app.com
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </AppContainer>
  );
}