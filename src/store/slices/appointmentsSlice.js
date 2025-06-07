import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await api.get('/turnos/usuario/todos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

// Confirmar un turno
export const confirmAppointment = createAsyncThunk(
  'appointments/confirmAppointment',
  async (appointmentId) => {
    const response = await api.patch(`/turnos/confirmar/${appointmentId}`);
    return response.data;
  }
);

// Reprogramar un turno
export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ turnoId, nuevaFecha, nuevaHoraInicio, nuevaHoraFin }) => {
    const response = await api.post(`/turnos/turnos/${turnoId}/reprogramar`,null,{
        params: {
          nuevaFecha,
          nuevaHoraInicio,
          nuevaHoraFin,
        },
      }
    );
    return response.data;
  }
);

// Cancelar un turno
export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async (appointmentId) => {
    console.log('Cancelando turno con ID:', appointmentId);
    const response = await api.patch(`/turnos/cancelar/${appointmentId}`);
    console.log('Respuesta de cancelar turno:', response.data);
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
        // Ajustar fechas agregando zona horaria local
        const getLocalOffset = () => {
          const offset = new Date().getTimezoneOffset();
          const absOffset = Math.abs(offset);
          const sign = offset <= 0 ? '+' : '-';
          const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
          const minutes = String(absOffset % 60).padStart(2, '0');
          return `${sign}${hours}:${minutes}`;
        };
        const localOffset = getLocalOffset();
        state.appointmentsByUser = action.payload.map(appt => ({
          ...appt,
          fecha: appt.fecha ? `${appt.fecha}T00:00:00${localOffset}` : appt.fecha
        }));
        //console.log('Turnos por usuario TURNOSSLICE:', state.appointmentsByUser);
      })
      // casos ya existentes
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.appointmentsByUser = state.appointmentsByUser.map((appointment) =>
          appointment.id === action.payload.id ? action.payload : appointment
        );
        console.log('Turno confirmado:', action.payload);
      })

      /* --------------- NUEVO CASO PARA CANCELAR --------------- */
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        /** 
         * action.payload  -> "cancelado con exito"
         * action.meta.arg -> appointmentId que enviamos al thunk
         */
        const cancelledId = action.meta.arg;

        state.appointmentsByUser = state.appointmentsByUser.map((appointment) =>
          appointment.id === cancelledId
            ? { ...appointment, estado: 'CANCELADO' } // o la propiedad que uses
            : appointment
        );
        // Opcional: podrías guardar un mensaje flash en el estado
        state.status = 'succeeded';
        console.log(`Turno ${cancelledId} cancelado localmente`);
      });
  },
});

export const { clearAvailableTimeSlots } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;