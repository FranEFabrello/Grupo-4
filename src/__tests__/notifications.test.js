// src/__tests__/notifications.test.js

import * as Device from 'expo-device';
import api from '../api/api';
import * as notificationsService from '../services/notifications';

describe('notifications service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerForPushNotificationsAsync', () => {
    it('debe devolver null si no es un dispositivo físico', async () => {
      // En lugar de spyOn accesores, basta asignar directamente:
      Device.isDevice = false;
      const result = await notificationsService.registerForPushNotificationsAsync();
      expect(result).toBeNull();
    });
  });

  describe('sendPushTokenToBackend', () => {
    it('debe devolver null si no hay token', async () => {
      const result = await notificationsService.sendPushTokenToBackend(null);
      expect(result).toBeNull();
    });

    it('debe llamar a api.post si hay token', async () => {
      const mockPost = jest.spyOn(api, 'post').mockResolvedValue({ data: 'ok' });
      const token = { data: '123' };
      const result = await notificationsService.sendPushTokenToBackend(token);
      expect(mockPost).toHaveBeenCalledWith(
        '/notifications/register-token',
        expect.objectContaining({ token: '123' })
      );
      expect(result).toBe('ok');
    });
  });

  describe('handleNotification', () => {
    it('debe hacer log de la notificación', () => {
      console.log = jest.fn();
      notificationsService.handleNotification({ foo: 'bar' });
      expect(console.log).toHaveBeenCalledWith('Notificación recibida:', { foo: 'bar' });
    });
  });

  describe('handleNotificationResponse', () => {
    it('debe hacer log de la respuesta', () => {
      console.log = jest.fn();
      notificationsService.handleNotificationResponse({ bar: 'foo' });
      expect(console.log).toHaveBeenCalledWith('Respuesta a la notificación:', { bar: 'foo' });
    });
  });
});
