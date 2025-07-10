import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DoctorCardForProf from '~/components/DoctorCardForProf';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }));

describe('DoctorCardForProf', () => {
  const props = {
    name: 'Dr. Pro',
    specialty: 'Neurology',
    stars: 5,
    noRating: false,
    onBook: jest.fn(),
    onPress: jest.fn(),
    colorScheme: 'light',
    imageUrl: null,
  };

  it('renders and matches snapshot', () => {
    const { toJSON } = render(<DoctorCardForProf {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('handles press and book actions', () => {
    const { getByText } = render(<DoctorCardForProf {...props} />);
    fireEvent.press(getByText('Dr. Pro'));
    fireEvent.press(getByText('doctor_card.book'));
    expect(props.onPress).toHaveBeenCalled();
    expect(props.onBook).toHaveBeenCalled();
  });
});

