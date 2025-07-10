import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchResults = createAsyncThunk('results/fetchResults', async (userId) => {
  const response = await api.get(`/estudios/usuario/info/${userId}`);
  //console.log('Fetched results:', response.data);
  return response.data;
});

const resultsSlice = createSlice({
  name: 'results',
  initialState: {
    results: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResults.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default resultsSlice.reducer;