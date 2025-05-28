import React from 'react';
import { SafeAreaView, View } from 'react-native';

import AppFooter from './AppFooter';
import AppHeader from './AppHeader';

export default function AppContainer({ children, navigation, screenTitle }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1">
        <AppHeader navigation={navigation} screenTitle={screenTitle} />
        <View className="flex-1">{children}</View>
        <AppFooter navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}