import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "~/api/api";

export const fetchProfessionals = createAsyncThunk('professionals/fetchProfessionals', async () => {
  const response =await api.get("/doctor/todos");
  console.log(response.data);
  return response.data;
});

const professionalsSlice = createSlice({
  name: 'professionals',
  initialState: {
    professionals: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessionals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfessionals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.professionals = action.payload;
      })
      .addCase(fetchProfessionals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default professionalsSlice.reducer;