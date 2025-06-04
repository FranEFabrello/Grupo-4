import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

export default function SplashScreen({ navigation }) {
  const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Home' : 'Welcome');
    }, 2500); // 2.5 segundos para mostrar animaciones

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <LinearGradient
      colors={['#e6f0fa', '#4a90e2']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <Animatable.View animation="fadeIn" duration={2000} style={styles.content}>
        <Animatable.View
          animation="pulse"
          easing="ease-in-out"
          iterationCount="infinite"
          duration={1500}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animatable.View>

        <Animatable.Text animation="fadeInDown" duration={1200} style={styles.title}>
          MediBook
        </Animatable.Text>

        <Animatable.Text animation="fadeIn" delay={800} style={styles.subtitle}>
          Tu app médica favorita
        </Animatable.Text>

        <Animatable.View animation="fadeIn" delay={1200} style={styles.loader}>
          <Progress.Circle size={30} indeterminate={true} color="#ffffff" borderWidth={3} />
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#f0f8ff',
    marginTop: 10,
  },
  loader: { marginTop: 20 },
});