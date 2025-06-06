import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://app3-0.onrender.com/',
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utilidades para guardar configuraciones
export const setLanguage = async (lang) => {
  await AsyncStorage.setItem('language', lang);
};

export const setTheme = async (theme) => {
  await AsyncStorage.setItem('theme', theme);
};

export default api;


// Endpoints disponibles:
// - GET /appointments: Obtener lista de turnos
// - POST /appointments: Reservar un turno
// - GET /professionals: Obtener lista de profesionales
// - GET /results: Obtener resultados médicos
// - GET /insurance: Obtener información de la obra social
// - GET /medical-notes/:id: Obtener notas médicas de un turno
// - GET /profile: Obtener información del usuario
// - GET /health-tips: Obtener consejos de salud