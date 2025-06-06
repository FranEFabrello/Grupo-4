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
      await api.patch(`/notificaciones/${notificacionId}/leer`);
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
    unreadCount: 0,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.leida).length;
    },
    markAsRead(state, action) {
      const id = action.payload;
      const notif = state.notificaciones.find(n => n.id === id);
      if (notif && !notif.leida) {
        notif.leida = true;
        state.unreadCount -= 1;
        if (state.unreadCount < 0) state.unreadCount = 0;
      }
    },
    incrementUnreadCount(state) {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.notificaciones = action.payload;
        //cuento la cantidad N notificaciones no leidas
        state.unreadCount = action.payload.filter(n => n.estado === "NO_LEÍDA").length;
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setNotifications, markAsRead , incrementUnreadCount} = notificationSlice.actions;
export default notificationSlice.reducer;