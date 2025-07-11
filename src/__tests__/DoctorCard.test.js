jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DoctorCard from '../components/DoctorCard';
describe('DoctorCard', () => {
  it('renderiza nombre y especialidad', () => {
    const { getByText } = render(<DoctorCard name="Dr. Test" specialty="Cardiología" stars={5} />);
    expect(getByText('Dr. Test')).toBeTruthy();
    expect(getByText('Cardiología')).toBeTruthy();
  });
  it('llama a onBook al presionar el botón', () => {
    const onBook = jest.fn();
    const { getByText } = render(<DoctorCard name="Dr. Test" specialty="Cardiología" stars={5} onBook={onBook} />);
    fireEvent.press(getByText(/reservar/i));
    expect(onBook).toHaveBeenCalled();
  });
  it('llama a onPress al presionar la tarjeta', () => {
    const onPress = jest.fn();
    const { getByText } = render(<DoctorCard name="Dr. Test" specialty="Cardiología" stars={5} onPress={onPress} />);
    fireEvent.press(getByText('Dr. Test'));
    expect(onPress).toHaveBeenCalled();
  });
}); 