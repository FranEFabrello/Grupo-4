import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4002/Usuario';

// Thunks para las operaciones asincrónicas
export const fetchUsuarios = createAsyncThunk(
  'user/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener los usuarios');
    }
  }
);

export const actualizarUsuarioPorCorreo = createAsyncThunk(
  'user/actualizarUsuarioPorCorreo',
  async ({ correo, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/actualizarPorCorreo`, updates, {
        params: { correo },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el usuario');
    }
  }
);

export const solicitarCambioContrasenia = createAsyncThunk(
  'user/solicitarCambioContrasenia',
  async (correo, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/solicitarCambioContrasenia`, { correo });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al solicitar el cambio de contraseña');
    }
  }
);

export const cambiarContrasenia = createAsyncThunk(
  'user/cambiarContrasenia',
  async ({ correo, nuevaContrasenia }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cambiarContrasenia`, { correo, nuevaContrasenia });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cambiar la contraseña');
    }
  }
);

export const actualizarFcmToken = createAsyncThunk(
  'user/actualizarFcmToken',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/usuario/${id}/fcm-token`, { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el token FCM');
    }
  }
);

export const obtenerUsuarioPorId = createAsyncThunk(
  'user/obtenerUsuarioPorId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/usuario/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener el usuario');
    }
  }
);

export const actualizarConfiguraciones = createAsyncThunk(
  'user/actualizarConfiguraciones',
  async ({ id, configuraciones }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/usuario/${id}/configuraciones`, configuraciones);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar las configuraciones');
    }
  }
);

export const enviarMensajeAyuda = createAsyncThunk(
  'user/enviarMensajeAyuda',
  async ({ correoUsuario, mensaje }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/ayuda`, { correoUsuario, mensaje });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al enviar el mensaje de ayuda');
    }
  }
);

export const cerrarSesion = createAsyncThunk(
  'user/cerrarSesion',
  async (usuarioId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cerrarSesion`, { usuarioId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cerrar la sesión');
    }
  }
);

export const desactivarCuenta = createAsyncThunk(
  'user/desactivarCuenta',
  async (usuarioId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/desactivarCuenta`, null, {
        params: { usuarioId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al desactivar la cuenta');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    usuarios: [],
    usuario: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUsuario(state, action) {
      state.usuario = action.payload;
    },
    clearUsuario(state) {
      state.usuario = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(actualizarUsuarioPorCorreo.fulfilled, (state, action) => {
        state.usuario = action.payload;
      })
      .addCase(obtenerUsuarioPorId.fulfilled, (state, action) => {
        state.usuario = action.payload;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.usuario = null;
      });
  },
});

export default userSlice.reducer;