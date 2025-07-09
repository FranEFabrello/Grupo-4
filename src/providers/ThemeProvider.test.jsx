import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider, useAppTheme } from './ThemeProvider';

function wrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('useAppTheme', () => {
  test('throws error when used outside provider', () => {
    const { result } = renderHook(() => {
      try {
        useAppTheme();
      } catch (e) {
        return e;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
  });

  test('returns theme context inside provider', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });
    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('colorScheme');
    expect(result.current).toHaveProperty('setTheme');
  });

  test('setTheme updates theme', () => {
    const { result } = renderHook(() => useAppTheme(), { wrapper });
    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
  });
});
