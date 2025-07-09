import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterButton from './FilterButton';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: () => 'Filter' }),
}));

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');

describe('FilterButton', () => {
  test('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FilterButton onPress={onPress} className="" textClassName="" iconColor="black" />
    );
    fireEvent.press(getByText('Filter'));
    expect(onPress).toHaveBeenCalled();
  });
});
