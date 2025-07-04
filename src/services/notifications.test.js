import { sendPushTokenToBackend, handleNotification, handleNotificationResponse } from './notifications';
import api from '~/api/api';

jest.mock('~/api/api', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'ok' })),
}));

describe('notifications service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendPushTokenToBackend posts token data', async () => {
    const token = { data: '123' };
    const result = await sendPushTokenToBackend(token);
    expect(api.post).toHaveBeenCalledWith('/notifications/register-token', {
      token: '123',
      deviceType: expect.any(String),
    });
    expect(result).toBe('ok');
  });

  test('handleNotification logs output', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleNotification('note');
    expect(logSpy).toHaveBeenCalledWith('Notificación recibida:', 'note');
    logSpy.mockRestore();
  });

  test('handleNotificationResponse logs output', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleNotificationResponse('resp');
    expect(logSpy).toHaveBeenCalledWith('Respuesta a la notificación:', 'resp');
    logSpy.mockRestore();
  });
});
