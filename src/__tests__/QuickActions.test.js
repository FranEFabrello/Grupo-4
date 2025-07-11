import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuickActions from '~/components/QuickActions';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');

describe('QuickActions', () => {
  const navigation = { navigate: jest.fn() };
  const actions = [
    { label: 'Action1', icon: 'home', screen: 'Screen1' },
    { label: 'Action2', icon: 'user', screen: 'Screen2' },
  ];

  it('renders actions and navigates on press', () => {
    const { getByText } = render(<QuickActions actions={actions} navigation={navigation} colorScheme="light" />);
    fireEvent.press(getByText('Action1'));
    expect(navigation.navigate).toHaveBeenCalledWith('Screen1');
  });
});