import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "~/api/api";


// Thunks para las operaciones asincrónicas
export const fetchObrasSociales = createAsyncThunk(
  'socialWorks/fetchObrasSociales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/todos`);
      console.log("debió traer todas las obras sociales -> ", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al obtener las obras sociales');
    }
  }
);

// Slice
const socialWorksSlice = createSlice({
  name: 'socialWorks',
  initialState: {
    obrasSociales: [],
    obraSocialEspecifica: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchObrasSociales
      .addCase(fetchObrasSociales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObrasSociales.fulfilled, (state, action) => {
        state.loading = false;
        state.obrasSociales = action.payload;
      })
      .addCase(fetchObrasSociales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default socialWorksSlice.reducer;