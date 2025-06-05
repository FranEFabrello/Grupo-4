import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "~/api/api";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Función auxiliar para guardar el token
const saveToken = async (key, value) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
    console.log('Token guardado:', value);
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
};

// Función auxiliar para eliminar el token
const removeToken = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('userToken');
    } else {
      await SecureStore.deleteItemAsync('userToken');
    }
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  }
};

// Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/Auth/register`, registerData);
      console.log('Respuesta del registro: ', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al registrar el usuario');
    }
  }
);

export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async (authData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/Auth/authenticate`, authData);
      const token = response.data.access_token;
      if (token) {
        await saveToken('userToken', token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al autenticar el usuario');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/Auth/logout');
      await removeToken();
      return {};
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al cerrar sesión');
    }
  }
);

// Slice
const authenticationSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = !!action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Authenticate
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.access_token || action.payload.token || null;
        state.isAuthenticated = !!action.payload.access_token;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setToken } = authenticationSlice.actions;
export default authenticationSlice.reducer;git status
