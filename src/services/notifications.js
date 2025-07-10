import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '~/api/api';

// Configuración de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función para registrar el dispositivo para notificaciones push
export async function registerForPushNotificationsAsync() {
  try {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      //console.log('Se debe usar un dispositivo físico para las notificaciones push');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      //console.log('¡Se requiere permiso para recibir notificaciones push!');
      return null;
    }
    
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    if (!token) {
      //console.log('No se pudo obtener el token de notificaciones');
      return null;
    }

    //console.log('Token de notificaciones obtenido exitosamente:', token);
    return token;
  } catch (error) {
    console.error('Error al registrar para notificaciones push:', error);
    return null;
  }
}

// Función para enviar el token al backend
export async function sendPushTokenToBackend(token) {
  try {
    if (!token) {
      //console.log('No hay token para enviar al backend');
      return null;
    }

    const response = await api.post('/notifications/register-token', {
      token: token.data,
      deviceType: Platform.OS,
    });
    
    //console.log('Token enviado al backend exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar el token al backend:', error);
    throw error;
  }
}

// Función para manejar las notificaciones recibidas
export function handleNotification(notification) {
  //console.log('Notificación recibida:', notification);
}

// Función para manejar las respuestas a las notificaciones
export function handleNotificationResponse(response) {
  //console.log('Respuesta a la notificación:', response);
  // Aquí puedes manejar la respuesta como necesites
} 