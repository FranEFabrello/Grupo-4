// src/__tests__/Calendar.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Calendar from '../components/Calendar';

// Fijamos la fecha del sistema al 1 de julio de 2025
beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date(2025, 6, 1)); // Mes 6 = julio (0-enero, 6-julio)
});

afterAll(() => {
  jest.useRealTimers();
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'filter.calendar.loading') return 'Cargando';
      if (key === 'filter.calendar.prev') return 'Anterior';
      if (key === 'filter.calendar.next') return 'Siguiente';
      if (key === 'filter.calendar.days.sun') return 'Dom';
      if (key === 'filter.calendar.days.mon') return 'Lun';
      if (key === 'filter.calendar.days.tue') return 'Mar';
      if (key === 'filter.calendar.days.wed') return 'Mié';
      if (key === 'filter.calendar.days.thu') return 'Jue';
      if (key === 'filter.calendar.days.fri') return 'Vie';
      if (key === 'filter.calendar.days.sat') return 'Sáb';
      return key;
    },
    i18n: { language: 'es' }
  }),
}));

describe('Calendar', () => {
  const availableDays = ['2025-07-01', '2025-07-02'];
  const onSelectDate = jest.fn();

  it('renderiza correctamente los controles de navegación', () => {
    const { getByText } = render(
      <Calendar
        availableDays={availableDays}
        onSelectDate={onSelectDate}
        selectedDate={null}
      />
    );

    expect(getByText('Anterior')).toBeTruthy();
    expect(getByText('Siguiente')).toBeTruthy();
  });

  it('permite seleccionar una fecha disponible (día 1)', () => {
    const { getByText } = render(
      <Calendar
        availableDays={availableDays}
        onSelectDate={onSelectDate}
        selectedDate={null}
      />
    );

    // Como el "hoy" está fijado al 1 de julio, el día 1 debe estar activo
    fireEvent.press(getByText('1'));
    expect(onSelectDate).toHaveBeenCalledWith('2025-07-01');
  });
});
