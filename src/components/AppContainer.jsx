import React from 'react';
import { SafeAreaView, View, useColorScheme } from 'react-native';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

export default function AppContainer({ children, navigation, screenTitle }) {
  const colorScheme = useColorScheme();
  const bgClass = colorScheme === 'dark' ? 'bg-darkBackground' : 'bg-lightBackground';

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <View className="flex-1">
        <AppHeader navigation={navigation} screenTitle={screenTitle} colorScheme={colorScheme} />
        <View className="flex-1">{children}</View>
        <AppFooter navigation={navigation} colorScheme={colorScheme} />
      </View>
    </SafeAreaView>
  );
}