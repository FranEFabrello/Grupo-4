import { configureStore } from '@reduxjs/toolkit';
import authenticationSlice from './slices/autheticationSlice.js';
import appointmentsReducer from './slices/appointmentsSlice';
import professionalsReducer from './slices/professionalsSlice';
import resultsReducer from './slices/resultsSlice';
import insuranceReducer from './slices/insuranceSlice';
import medicalNotesReducer from './slices/medicalNotesSlice';
import profileReducer from './slices/profileSlice';
import healthTipsReducer from './slices/healthTipsSlice';
import socialWorksReducer from "~/store/slices/socialWorksSlice";
import userSlice from "~/store/slices/userSlice";
import tokenReducer from './slices/tokenSlice.js';
import medicalSpecialitiesReducer from './slices/medicalSpecialitiesSlice.js';
import notificationSlice from "~/store/slices/notificationSlice";
import '../i18n';

export const store = configureStore({
  reducer: {
    auth: authenticationSlice,
    appointments: appointmentsReducer,
    professionals: professionalsReducer,
    results: resultsReducer,
    insurance: insuranceReducer,
    medicalNotes: medicalNotesReducer,
    profile: profileReducer,
    healthTips: healthTipsReducer,
    socialWork: socialWorksReducer,
    user: userSlice,
    tokens: tokenReducer,
    medicalSpecialities: medicalSpecialitiesReducer,
    notifications: notificationSlice,
  },
});

export default store;