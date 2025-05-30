// src/redux/slices/tokenSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "~/api/api";

export const validarTokenRegistro = createAsyncThunk(
  'tokens/validarTokenRegistro',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/validarTokenRegistro`, data);
      // Guarda el token si existe en la respuesta
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('access_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { mensaje: 'Error al validar token de registro' });
    }
  }
);

export const validarTokenCambioContrasenia = createAsyncThunk(
  'tokens/validarTokenCambioContrasenia',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/validarTokenCambioContrasenia`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { mensaje: 'Error al cambiar contraseña' });
    }
  }
);

const tokenSlice = createSlice({
  name: 'tokens',
  initialState: {
    loading: false,
    error: null,
    registroResponse: null,
    cambioContraseniaResponse: null,
  },
  reducers: {
    resetRegistroState: (state) => {
      state.loading = false;
      state.error = null;
      state.registroResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Token Registro
      .addCase(validarTokenRegistro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validarTokenRegistro.fulfilled, (state, action) => {
        state.loading = false;
        state.registroResponse = action.payload;
      })
      .addCase(validarTokenRegistro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Token Cambio Contraseña
      .addCase(validarTokenCambioContrasenia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validarTokenCambioContrasenia.fulfilled, (state, action) => {
        state.loading = false;
        state.cambioContraseniaResponse = action.payload;
      })
      .addCase(validarTokenCambioContrasenia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegistroState } = tokenSlice.actions;
export default tokenSlice.reducer;
