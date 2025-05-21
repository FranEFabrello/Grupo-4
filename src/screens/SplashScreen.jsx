import React, { useEffect } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress'; // Para el loader

export default function SplashScreen({ navigation }) {
  const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false });

  useEffect(() => {
    console.log('SplashScreen: Renderizando');

    const checkAuthAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setTimeout(() => {
          console.log('SplashScreen: Redirigiendo');
          navigation.replace(token ? 'Home' : 'Welcome');
        }, 3000); // Aumentamos a 3 segundos para que las animaciones se aprecien
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        navigation.replace('Welcome');
      }
    };

    checkAuthAndNavigate();

    return () => {
      console.log('SplashScreen: Limpiando');
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#e6f0fa', '#4a90e2']} // Colores más suaves y médicos
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      <Animatable.View
        animation="fadeIn"
        duration={2000}
        style={styles.content}
      >
        {/* Logo con animación de brillo pulsante */}
        <Animatable.View
          animation="pulse"
          easing="ease-in-out"
          iterationCount="infinite"
          duration={1500}
        >
          <Image
            source={require('../assets/logo.png')} // El logo que compartiste
            style={styles.logo}
            resizeMode="contain"
          />
        </Animatable.View>

        {/* Título con animación de entrada */}
        <Animatable.Text
          animation="fadeInDown"
          duration={1200}
          style={styles.title}
        >
          MediBook
        </Animatable.Text>

        {/* Subtítulo con efecto de escritura */}
        <Animatable.Text
          animation="fadeIn"
          delay={800}
          style={styles.subtitle}
        >
          Tú app medica favorita
        </Animatable.Text>

        {/* Indicador de carga */}
        <Animatable.View
          animation="fadeIn"
          delay={1200}
          style={styles.loader}
        >
          <Progress.Circle
            size={30}
            indeterminate={true}
            color="#ffffff"
            borderWidth={3}
          />
        </Animatable.View>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    // Sombra para resaltar el logo
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
    fontFamily: 'Roboto-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#f0f8ff',
    fontFamily: 'Roboto-Regular',
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
});