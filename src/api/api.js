import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.medibook.com', // Reemplazar con la URL real de la API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints disponibles:
// - GET /appointments: Obtener lista de turnos
// - POST /appointments: Reservar un turno
// - GET /professionals: Obtener lista de profesionales
// - GET /results: Obtener resultados médicos
// - GET /insurance: Obtener información de la obra social
// - GET /medical-notes/:id: Obtener notas médicas de un turno
// - GET /profile: Obtener información del usuario
// - GET /health-tips: Obtener consejos de salud

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    // Aquí puedes agregar un token desde Redux o AsyncStorage
    // const token = store.getState().auth.token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;