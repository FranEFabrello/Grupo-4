import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchHealthTips = createAsyncThunk('healthTips/fetchHealthTips', async () => {
  const response = await api.get('/health-tips');
  return response.data;
});

const healthTipsSlice = createSlice({
  name: 'healthTips',
  initialState: {
    tips: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthTips.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHealthTips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tips = action.payload;
      })
      .addCase(fetchHealthTips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default healthTipsSlice.reducer;