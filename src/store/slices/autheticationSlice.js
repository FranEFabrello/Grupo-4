import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://localhost:4002/Auth';

// Thunks para las operaciones asincrónicas
export const register = createAsyncThunk(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, registerData);
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
      const response = await axios.post(`${API_URL}/authenticate`, authData);
      const token = response.data.access_token;
      if (token) {
        await AsyncStorage.setItem('bearerToken', token);
        //console.log('token al iniciar sesion: ', token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al autenticar el usuario');
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
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
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
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;

