import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "~/api/api";

// Thunk para obtener notificaciones por ID de usuario
export const fetchNotificaciones = createAsyncThunk(
  'notificaciones/fetchNotificaciones',
  async (userId, thunkAPI) => {
    const response = await api.get(`/notificaciones/usuarios/${userId}`);
    console.log("Notificaicones: ", response.data)
    return response.data;
  }
);

export const marcarNotificacionLeida = createAsyncThunk(
  'notifications/marcarNotificacionLeida',
  async (notificacionId, { rejectWithValue }) => {
    try {
      await api.patch(`/notificaciones/${notificacionId}/leida`);
      return notificacionId;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al marcar como leída');
    }
  }
);


const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notificaciones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.notificaciones = action.payload;
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default notificationSlice.reducer;