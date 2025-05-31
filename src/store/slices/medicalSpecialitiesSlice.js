import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '~/api/api';

// Thunk para obtener especialidades médicas
export const fetchSpecialities = createAsyncThunk(
  'medicalSpecialities/fetchSpecialities',
  async (_, thunkAPI) => {
    const response = await api.get('/especialidad/todos');
    //console.log("Especialidades: ",response.data);
    return response.data;
  }
);

const medicalSpecialitiesSlice = createSlice({
  name: 'medicalSpecialities',
  initialState: {
    specialities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialities.fulfilled, (state, action) => {
        state.loading = false;
        state.specialities = action.payload;
      })
      .addCase(fetchSpecialities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default medicalSpecialitiesSlice.reducer;