// __tests__/HealthTipsScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HealthTipsScreen from '~/screens/HealthTipsScreen';
import { Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock SafeAreaInsets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));
// Mock AppContainer to render children directly
jest.mock('../components/AppContainer', () => ({ children }) => <>{children}</>);
// Mock i18n translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key, i18n: { language: 'en' } }),
}));

// Mock fetch
global.fetch = jest.fn();
// Mock Linking.openURL
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

describe('HealthTipsScreen', () => {
  const page1Articles = Array(10).fill({
    url: 'https://example.com/1',
    urlToImage: 'https://example.com/img1.jpg',
    title: 'Title 1',
    publishedAt: '2025-07-10T12:00:00Z',
    source: { name: 'Source1' },
    description: 'Desc1',
  });
  const page2Articles = [
    {
      url: 'https://example.com/2',
      urlToImage: null,
      title: 'Title 2',
      publishedAt: '2025-07-11T13:00:00Z',
      source: { name: 'Source2' },
      description: '',
    },
  ];

  beforeEach(() => {
    useSafeAreaInsets.mockReturnValue({ bottom: 0 });
    fetch.mockReset();
    fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve({ status: 'ok', articles: page1Articles }) })
      .mockResolvedValueOnce({ json: () => Promise.resolve({ status: 'ok', articles: page2Articles }) });
  });

  it('fetches and displays first page of articles', async () => {
    const { getAllByText, getByText } = render(<HealthTipsScreen navigation={{}} />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(getAllByText('Title 1').length).toBeGreaterThan(0);
    expect(getAllByText('Source1').length).toBeGreaterThan(0);
    const formattedDate = new Date(page1Articles[0].publishedAt)
      .toLocaleDateString('en', { day: '2-digit', month: '2-digit', year: 'numeric' });
    expect(getAllByText(formattedDate).length).toBeGreaterThan(0);
  });

  it('opens article link on press', async () => {
    const { getAllByText } = render(<HealthTipsScreen navigation={{}} />);
    await waitFor(() => expect(getAllByText('Title 1').length).toBeGreaterThan(0));
    fireEvent.press(getAllByText('Title 1')[0]);
    expect(Linking.openURL).toHaveBeenCalledWith(page1Articles[0].url);
  });

});
