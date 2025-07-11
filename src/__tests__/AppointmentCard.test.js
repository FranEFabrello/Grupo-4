import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentCard from '~/components/AppointmentCard';

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key, i18n: {} }) }));

describe('AppointmentCard', () => {
  const props = {
    day: '10',
    time: '15:00',
    doctor: 'Dr. House',
    specialty: 'Diagnostics',
    status: 'confirmed',
    onPress: jest.fn(),
    colorScheme: 'light',
  };

  it('renders correctly and matches snapshot', () => {
    const { toJSON, getByText } = render(<AppointmentCard {...props} />);
    expect(getByText('10')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<AppointmentCard {...props} />);
    fireEvent.press(getByText('10'));
    expect(props.onPress).toHaveBeenCalled();
  });
});

