import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TimeSlot from '../components/TimeSlot';

describe('TimeSlot component', () => {
  it('muestra el texto del horario y responde al toque', () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <TimeSlot time="10:00-10:30" isSelected={false} onSelect={mockSelect} colorScheme="light" />
    );

    const timeText = getByText('10:00-10:30');
    expect(timeText).toBeTruthy();

    fireEvent.press(timeText);
    expect(mockSelect).toHaveBeenCalled();
  });
});
