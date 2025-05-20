import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (userId) => {
  console.log("Este debería entrar como fetchProfile");
  const response = await api.get(`/usuario/${userId}`);
  return response.data;
});

export const updateProfile = createAsyncThunk('profile/updateProfile', async ({ correo, updates }) => {
  const response = await api.patch(`/usuario/actualizarPorCorreo?correo=${encodeURIComponent(correo)}`, updates);
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