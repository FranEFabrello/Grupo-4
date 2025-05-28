import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useColorScheme } from 'react-native';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

export default function AppContainer({ children, navigation, screenTitle }) {
  const colorScheme = useColorScheme();
  const containerClass = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  return (
    <SafeAreaView className={`flex-1 ${containerClass}`}>
      <View className={`flex-1 ${containerClass}`}>
        <AppHeader navigation={navigation} screenTitle={screenTitle} />
        <View className="flex-1">{children}</View>
        <AppFooter navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}