// jest.setup.js
// Coloca este archivo en la raíz de tu proyecto (junto a jest.config.js).

// 0) Mock de AsyncStorage
jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 1) i18n / react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const map = {
        'doctor_card.book': 'Reservar',
        'doctor_card.no_rating': 'Sin calificaciones',
      };
      return map[key] ?? key;
    },
    i18n: { language: 'es', changeLanguage: jest.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

// 2) ~/.i18n local (si lo usas)
jest.mock('~/i18n', () => ({
  __esModule: true,
  default: {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    t: (key) => key,
    i18n: { language: 'es', changeLanguage: jest.fn() },
  },
}));

// 3) ThemeProvider y SafeArea
jest.mock('~/providers/ThemeProvider', () => ({
  useAppTheme: () => ({ colorScheme: 'light', useColorScheme: () => 'light' }),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// 4) Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// 5) Picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: ({ children }) => children,
  PickerItem: jest.fn(),
}));

// 6) NativeWind (si lo usas)
jest.mock('nativewind', () => ({
  NativeWindStyleSheet: { setOutput: jest.fn() },
}));

// 7) Expo modules core
jest.mock('expo-modules-core', () => ({
  requireOptionalNativeModule: jest.fn(),
  requireNativeModule: jest.fn(),
}));

// 8) Expo Constants / Notifications / Device
jest.mock('expo-constants', () => ({ manifest: {} }));
jest.mock('expo-device', () => ({
  // Definimos isDevice como propiedad para permitir jest.spyOn(..., 'get')
  get isDevice() {
    return false;
  },
}));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: 'test-token' }),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(),
}));

// 9) Expo Winter FormData
jest.mock('expo/src/winter/FormData', () => {
  return global.FormData || class FormData {
    append(){} delete(){} get(){} getAll(){} has(){} set(){}
    entries(){} keys(){} values(){}
  };
});

// 10) Testing Library extensions
import '@testing-library/jest-native/extend-expect';
