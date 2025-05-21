import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:4002',
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