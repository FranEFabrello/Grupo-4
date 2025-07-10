import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TabButton from '../components/TabButton';
describe('TabButton', () => {
  it('renderiza el label', () => {
    const { getByText } = render(<TabButton label="Inicio" isActive={false} />);
    expect(getByText('Inicio')).toBeTruthy();
  });
  it('llama a onPress al presionar', () => {
    const onPress = jest.fn();
    const { getByText } = render(<TabButton label="Inicio" isActive={false} onPress={onPress} />);
    fireEvent.press(getByText('Inicio'));
    expect(onPress).toHaveBeenCalled();
  });
}); 