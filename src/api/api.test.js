import { setLanguage, setTheme } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('api utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setLanguage stores language in AsyncStorage', async () => {
    await setLanguage('es');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('language', 'es');
  });

  test('setTheme stores theme in AsyncStorage', async () => {
    await setTheme('dark');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});
