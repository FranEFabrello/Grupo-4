import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterButton from '~/components/FilterButton';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => 'Filter' }) }));

describe('FilterButton', () => {
  it('renders label from translation and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<FilterButton onPress={onPress} className="bg-blue-100" textClassName="text-sm" iconColor="#000" />);
    expect(getByText('Filter')).toBeTruthy();
    fireEvent.press(getByText('Filter'));
    expect(onPress).toHaveBeenCalled();
  });
});
