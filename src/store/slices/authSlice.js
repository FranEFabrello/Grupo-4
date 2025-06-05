import { createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Guardar el token en SecureStore
      SecureStore.setItemAsync('userToken', action.payload.token).catch((error) =>
        console.error('Error guardando token:', error)
      );
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Eliminar el token de SecureStore
      SecureStore.deleteItemAsync('userToken').catch((error) =>
        console.error('Error eliminando token:', error)
      );
    },
    setToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        SecureStore.setItemAsync('userToken', action.payload).catch((error) =>
          console.error('Error guardando token:', error)
        );
      }
    },
  },
});

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;