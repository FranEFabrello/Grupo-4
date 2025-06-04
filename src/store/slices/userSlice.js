import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "~/api/api";
import { create } from "axios";

// Thunks para las operaciones asincrónicas
export const fetchUsuarios = createAsyncThunk(
  'user/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/usuarios`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener los usuarios');
    }
  }
);

export const fetchUserByToken = createAsyncThunk(
  'user/fetchUserByToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('bearerToken');
      console.log('Token obtenido de AsyncStorage:', token);
      const response = await api.get('Usuario/usuario/info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Respuesta de /usuario/info:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener el usuario por token');
    }
  }
);



export const actualizarUsuarioPorCorreo = createAsyncThunk(
  'user/actualizarUsuarioPorCorreo',
  async ({ correo, updates }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/actualizarPorCorreo`, updates, {
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
      const response = await api.post('Usuario/solicitarCambioContrasenia', correo );
      console.log('Respuesta de solicitar cambio contraseña: ', response.data);
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
      const response = await api.post(`/Usuario/cambiarContrasenia`, { correo, nuevaContrasenia });
      console.log('Respuesta de cambiar contraseña: ', response.data);
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
      const response = await api.put(`/usuario/${id}/fcm-token`, { token });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al actualizar el token FCM');
    }
  }
);


export const actualizarConfiguraciones = createAsyncThunk(
  'user/actualizarConfiguraciones',
  async ({ id, configuraciones }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/Usuario/usuario/${id}/configuraciones`, configuraciones);
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
      const response = await api.post(`/ayuda`, { correoUsuario, mensaje });
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
      const response = await api.post(`/cerrarSesion`, { usuarioId });
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
      const response = await api.patch(`/desactivarCuenta`, null, {
        params: { usuarioId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al desactivar la cuenta');
    }
  }
);


export const guardarSuscripcionWebPush = createAsyncThunk(
  'user/guardarSuscripcionWebPush',
  async (subscription, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/user/webpush/subscribe', subscription);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al guardar la suscripción');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    usuarios: [],
    usuario: null,
    modoOscuro: false,
    loading: false,
    error: null,
    webPushStatus: 'idle',
    webPushError: null,
  },
  reducers: {
    setUsuario(state, action) {
      state.usuario = action.payload;
    },
    clearUsuario(state) {
      state.usuario = null;
    },
    setModoOscuro(state, action) {
      if (state.usuario) {
        state.usuario.modoOscuro = action.payload;
      }
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
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.usuario = null;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
      state.usuario = action.payload;
      //console.log('action.payload del usuario: ', state.usuario);
      })
      .addCase(guardarSuscripcionWebPush.pending, (state) => {
        state.webPushStatus = 'loading';
        state.webPushError = null;
      })
      .addCase(guardarSuscripcionWebPush.fulfilled, (state) => {
        state.webPushStatus = 'succeeded';
      })
      .addCase(guardarSuscripcionWebPush.rejected, (state, action) => {
        state.webPushStatus = 'failed';
        state.webPushError = action.payload;
      });
  },
});

export const { setModoOscuro } = userSlice.actions;
export default userSlice.reducer;