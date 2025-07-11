jest.mock('expo-blur', () => ({ __esModule: true, BlurView: () => null }));

import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingOverlay from '~/components/LoadingOverlay';

jest.useFakeTimers();

describe('LoadingOverlay', () => {
  it('renders pulse animation and matches snapshot', () => {
    const { toJSON } = render(<LoadingOverlay />);
    jest.advanceTimersByTime(2500);
    expect(toJSON()).toMatchSnapshot();
  });
});