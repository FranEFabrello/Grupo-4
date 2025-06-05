import React from 'react';
import { SafeAreaView, View, useColorScheme } from 'react-native';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import { useSelector } from "react-redux";

export default function AppContainer({ children, navigation, screenTitle }) {
  const modoOscuro = useSelector(state => state.user.modoOscuro);
  const colorScheme = modoOscuro ? 'dark' : 'light';
  const bgClass = colorScheme === 'dark' ? 'bg-darkBackground' : 'bg-lightBackground';

  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <View style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fff' : '#1F2937' }}>
        <AppHeader navigation={navigation} screenTitle={screenTitle} colorScheme={colorScheme} />
        <View className="flex-1">{children}</View>
        <AppFooter navigation={navigation} colorScheme={colorScheme} />
      </View>
    </SafeAreaView>
  );
}