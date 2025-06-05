import React from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from "~/providers/ThemeProvider";

export default function CustomStatusBar() {

  const { colorScheme } = useAppTheme();
  const darkMode = colorScheme === 'dark'


  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      {Platform.OS === 'android' && (
        <RNStatusBar
          backgroundColor={darkMode ? '#1e3a8a' : '#3b82f6'}
          barStyle={darkMode ? 'dark-content' : 'dark-content'}
          translucent={false}
        />
      )}
    </>
  );
}