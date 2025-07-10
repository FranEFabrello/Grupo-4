import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId) => {
  //console.log("Este debería entrar como fetchProfile");
  const response = await api.get(`/usuario/${userId}`);
  return response.data;
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async (updates) => {
  //console.log("Payload enviado a updateProfile:", updates);
  const token = await AsyncStorage.getItem('userToken');
  //console.log("Token utilizado en updateProfile:", token);
  const response = await api.patch(`/Usuario/actualizarPorCorreo`, updates, {
    headers: { Authorization: `Bearer ${token}` }
  });
  //console.log("Respuesta de updateProfile: ", response.data);
  return response.data;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default profileSlice.reducer;