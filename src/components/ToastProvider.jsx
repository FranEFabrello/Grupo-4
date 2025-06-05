import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useColorScheme } from 'react-native';



const SuccessToast = ({ text1, text2, hide }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? styles.textLight : styles.textDark;
  const secondaryText = colorScheme === 'light' ? styles.textSecondaryLight : styles.textSecondaryDark;

  return (
    <TouchableToast hide={hide}>
      <View style={styles.content}>
        <Icon name="check-circle" size={24} color="#22c55e" />
        <View style={styles.textWrapper}>
          <Text style={[styles.title, textColor]}>{text1}</Text>
          {text2 && <Text style={[styles.message, secondaryText]}>{text2}</Text>}
        </View>
      </View>
    </TouchableToast>
  );
};

const ErrorToast = ({ text1, text2, hide }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? styles.textLight : styles.textDark;
  const secondaryText = colorScheme === 'light' ? styles.textSecondaryLight : styles.textSecondaryDark;

  return (
    <TouchableToast hide={hide}>
      <View style={styles.content}>
        <Icon name="error" size={24} color="#ef4444" />
        <View style={styles.textWrapper}>
          <Text style={[styles.title, textColor]}>{text1}</Text>
          {text2 && <Text style={[styles.message, secondaryText]}>{text2}</Text>}
        </View>
      </View>
    </TouchableToast>
  );
};

const InfoToast = ({ text1, text2, hide }) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? styles.textLight : styles.textDark;
  const secondaryText = colorScheme === 'light' ? styles.textSecondaryLight : styles.textSecondaryDark;

  return (
    <TouchableToast hide={hide}>
      <View style={styles.content}>
        <Icon name="info" size={24} color="#3b82f6" />
        <View style={styles.textWrapper}>
          <Text style={[styles.title, textColor]}>{text1}</Text>
          {text2 && <Text style={[styles.message, secondaryText]}>{text2}</Text>}
        </View>
      </View>
    </TouchableToast>
  );
};


// Componente con animación y cierre por toque
const TouchableToast = ({ children, hide }) => {
  const translateY = useSharedValue(-100);
  const colorScheme = useColorScheme();

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 400,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const containerClass = colorScheme === 'light' ? styles.toastLight : styles.toastDark;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={hide}>
      <Animated.View style={[styles.toastContainer, containerClass, animatedStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Toasts personalizados
const toastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  info: (props) => <InfoToast {...props} />,
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    padding: 14,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 5,
  },
  toastLight: {
    backgroundColor: '#f0f9ff', // bg-blue-50
  },
  toastDark: {
    backgroundColor: '#374151', // bg-gray-700
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    marginTop: 2,
  },
  textLight: {
    color: '#1f2937', // text-gray-800
  },
  textDark: {
    color: '#e5e7eb', // text-gray-200
  },
  textSecondaryLight: {
    color: '#4b5563', // text-gray-600
  },
  textSecondaryDark: {
    color: '#9ca3af', // text-gray-400
  },
});

// Proveedor
export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastManager config={toastConfig} position="top" />
    </>
  );
}

// Utilidad global
export const showToast = (type, text1, text2, options = {}) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top',
    visibilityTime: options.visibilityTime || 4000,
    autoHide: options.autoHide !== undefined ? options.autoHide : true,
    ...options,
  });
};
