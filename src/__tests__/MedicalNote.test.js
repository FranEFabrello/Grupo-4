import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MedicalNote from '~/components/MedicalNote'

// Mock dependencies
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('~/components/ProfileField.jsx', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return ({ label, value }) => (
    <View>
      {label && <Text>{label}</Text>}
      <Text>{value}</Text>
    </View>
  );
});
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }));

describe('MedicalNote', () => {
  const props = {
    doctor: 'Dr. Smith',
    date: '2025-07-10',
    reason: 'Checkup',
    diagnosis: 'Healthy',
    notes: 'All good',
    prescription: 'Vitamin C',
    onDownload: jest.fn(),
  };

  it('renders all fields correctly and matches snapshot', () => {
    const { toJSON, getByText } = render(<MedicalNote {...props} />);
    expect(getByText('Dr. Smith')).toBeTruthy();
    expect(getByText('2025-07-10')).toBeTruthy();
    expect(getByText('Checkup')).toBeTruthy();
    expect(getByText('Healthy')).toBeTruthy();
    expect(getByText('All good')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

});