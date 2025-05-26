import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (usuarioId) => {
    const response = await api.get(`/turnos/usuario/${usuarioId}/todos`);
    console.log('Response de turnos:', response.data);
    return response.data;
  }
);


// Obtener días disponibles para un doctor
export const fetchAvailableDays = createAsyncThunk(
  'appointments/fetchAvailableDays',
  async (professionalId) => {
    const response = await api.get(`/turnos/${professionalId}/dias-disponibles`);
    return response.data;
  }
);

// Obtener horarios disponibles para un doctor en un día
export const fetchAvailableTimeSlots = createAsyncThunk(
  'appointments/fetchAvailableTimeSlots',
  async ({ professionalId, date }) => {
    const response = await api.get(`/turnos/${professionalId}/disponibilidad/${date}`);
    return response.data;
  }
);

// Crear un turno
export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData) => {
    const response = await api.post('/turnos/crear', appointmentData);
    return response.data;
  }
);



const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    availableDays: [],
    availableTimeSlots: [],
    appointmentsByUser: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearAvailableTimeSlots: (state) => {
      state.availableTimeSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableDays.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableDays.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableDays = action.payload;
      })
      .addCase(fetchAvailableDays.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableTimeSlots = action.payload;
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        // No hace falta guardar el turno en el store en este caso
      })
      .addCase(fetchAppointments.fulfilled, (state,action) => {
        state.status = 'succeeded';
        state.appointmentsByUser = action.payload;
        console.log('Turnos por usuario TURNOSSLICE:', action.payload);
      });
  },
});

export const { clearAvailableTimeSlots } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
