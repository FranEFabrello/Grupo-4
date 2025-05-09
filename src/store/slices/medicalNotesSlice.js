import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

export const fetchMedicalNotes = createAsyncThunk('medicalNotes/fetchMedicalNotes', async (appointmentId) => {
  const response = await api.get(`/medical-notes/${appointmentId}`);
  return response.data;
});

const medicalNotesSlice = createSlice({
  name: 'medicalNotes',
  initialState: {
    notes: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalNotes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicalNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(fetchMedicalNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default medicalNotesSlice.reducer;