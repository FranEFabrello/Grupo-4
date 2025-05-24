import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchInsurance = createAsyncThunk('insurance/fetchInsurance', async (id)  => {
  const response = await api.get(`/obrasSociales/${id}`);
  console.log('fetchInsurance: Obteniendo información de obra social', response.data);
  return response.data;
});

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState: {
    insurance: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsurance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInsurance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.insurance = action.payload;
      })
      .addCase(fetchInsurance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default insuranceSlice.reducer;