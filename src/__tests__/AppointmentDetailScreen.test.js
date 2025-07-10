import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentDetailScreen from '~/screens/AppointmentDetailScreen';
import { useDispatch, useSelector } from 'react-redux';

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock navigation and route
const mockNavigate = jest.fn();
const route = {
  params: {
    appointment: {
      id: 1,
      fecha: '2025-07-10',
      horaInicio: '09:00',
      horaFin: '10:00',
      estado: 'CONFIRMADO',
      doctorInfo: { nombre: 'John', apellido: 'Doe' },
      especialidadInfo: { descripcion: 'Cardio' },
      nota: 'Consultation reason',
    },
  },
};
const navigation = { navigate: mockNavigate };

// Mock other dependencies
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('expo-blur', () => ({ __esModule: true, BlurView: () => null }));
jest.mock('../components/LoadingOverlay', () => () => null);
jest.mock('../components/AppFooter', () => () => null);
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key, i18n: { language: 'en' } }) }));
jest.mock('~/providers/ThemeProvider', () => ({ useAppTheme: () => ({ colorScheme: 'light' }) }));

describe('AppointmentDetailScreen', () => {
  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
    useSelector.mockImplementation(selector => selector({
      appointments: {
        status: 'idle',
        error: null,
        appointmentsByUser: [route.params.appointment],
      },
      user: {
        usuario: { id: 1 },
      },
      notifications: {
        unreadCount: 0,
      },
    }));
  });

  it('renders all appointment details correctly and matches snapshot', () => {
    const { toJSON, getByText } = render(
      <AppointmentDetailScreen route={route} navigation={navigation} />
    );
    // Header title
    expect(getByText('appointments.details')).toBeTruthy();
    // Appointment summary
    expect(getByText('appointments.medic_book')).toBeTruthy();
    expect(getByText('appointments.type.approved')).toBeTruthy();
    // Date & Time
    expect(getByText('Thursday, July 10, 2025')).toBeTruthy();
    expect(getByText('09:00 - 10:00')).toBeTruthy();
    // Professional info
    expect(getByText('Dr. John Doe')).toBeTruthy();
    expect(getByText('Cardio')).toBeTruthy();
    // Medical note reason
    expect(getByText('Consultation reason')).toBeTruthy();
    // Action buttons
    expect(getByText('global.button.cancel')).toBeTruthy();
    expect(getByText('appointments.reschedule')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('navigates to reschedule screen on reschedule button press', () => {
    const { getByText } = render(
      <AppointmentDetailScreen route={route} navigation={navigation} />
    );
    fireEvent.press(getByText('appointments.reschedule'));
    expect(mockNavigate).toHaveBeenCalledWith(
      'BookAppointment',
      expect.objectContaining({ reprogramming: true })
    );
  });
});
