import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { useAppTheme } from "~/providers/ThemeProvider";
const { width } = Dimensions.get('window');

import Ionicons from '@expo/vector-icons/Ionicons';

const BASE_SCALE = 2.5;
const SIZE = width * 0.3 * BASE_SCALE;
const LOGO_SIZE = SIZE * 0.5;

const pulseAnimation = {
  0: {
    scale: 1,
    opacity: 0,
  },
  0.2: {
    scale: 1.2,
    opacity: 1,
  },
  0.7: {
    scale: 2.5,
    opacity: 0,
  },
  1: {
    scale: 3,
    opacity: 0,
  },
};

const blueTones = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

export default function LoadingOverlay() {
  const { colorScheme } = useAppTheme();
  const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

  const [activeHearts, setActiveHearts] = useState([]);

  // Va agregando corazones de a uno
  useEffect(() => {
    blueTones.forEach((_, index) => {
      setTimeout(() => {
        setActiveHearts((prev) => [...prev, index]);
      }, index * 500); // delay entre apariciones
    });
  }, []);

  return (
    <BlurView intensity={50} tint={blurTint} style={styles.blur}>
      <View style={[styles.container, { width: SIZE, height: SIZE }]}>
        {activeHearts.map((i) => (
          <Animatable.View
            key={i}
            animation={pulseAnimation}
            iterationCount="infinite"
            duration={2000}
            useNativeDriver
            style={styles.pulse}
          >
            <Ionicons name="heart-outline" size={LOGO_SIZE * 0.9} color={blueTones[i]} />
          </Animatable.View>
        ))}

        <Image
          source={require('../assets/logo.png')}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          resizeMode="contain"
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulse: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
