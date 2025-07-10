import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentsCalendar from '~/components/AppointmentsCalendar';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key, i18n: { language: 'en' } }) }));

describe('AppointmentsCalendar', () => {
  const onSelectDate = jest.fn();

  it('renders current month and navigates months', () => {
    const { getByText } = render(<AppointmentsCalendar selectedDate={null} endDate={null} onSelectDate={onSelectDate} />);
    const prev = getByText('filter.calendar.prev');
    const next = getByText('filter.calendar.next');
    fireEvent.press(prev);
    fireEvent.press(next);
  });

  it('calls onSelectDate when a valid day is pressed', () => {
    const { getByText } = render(<AppointmentsCalendar selectedDate={null} endDate={null} onSelectDate={onSelectDate} />);
    const day = getByText('1');
    fireEvent.press(day);
    expect(onSelectDate).toHaveBeenCalled();
  });
});

