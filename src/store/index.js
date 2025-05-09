import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import professionalsReducer from './slices/professionalsSlice';
import resultsReducer from './slices/resultsSlice';
import insuranceReducer from './slices/insuranceSlice';
import medicalNotesReducer from './slices/medicalNotesSlice';
import profileReducer from './slices/profileSlice';
import healthTipsReducer from './slices/healthTipsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    professionals: professionalsReducer,
    results: resultsReducer,
    insurance: insuranceReducer,
    medicalNotes: medicalNotesReducer,
    profile: profileReducer,
    healthTips: healthTipsReducer,
  },
});

export default store;