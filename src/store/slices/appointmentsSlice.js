import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchAppointments = createAsyncThunk('appointments/fetchAppointments', async () => {
  const response = await api.get('/appointments');
  return response.data;
});

export const bookAppointment = createAsyncThunk('appointments/bookAppointment', async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
});

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      });
  },
});

export default appointmentsSlice.reducer;