// useAppInitialData.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchUserByToken, setModoOscuro } from '~/store/slices/userSlice';
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import { fetchNotificaciones } from '~/store/slices/notificationSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "~/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

export function useAppInitialData(shouldFetch = true) {
  const dispatch = useDispatch();
  const professionals = useSelector((state) => state.professionals.professionals);
  const usuario = useSelector((state) => state.user.usuario);
  const specialities = useSelector((state) => state.medicalSpecialities.specialities);

  useEffect(() => {
    if (!shouldFetch) return;

    if (!professionals || professionals.length === 0) {
      dispatch(fetchProfessionals());
    }
    if (!usuario) {
      dispatch(fetchUserByToken()).then((action) => {
        const usuarioData = action.payload;
        const usuarioId = usuarioData?.id;
        if (usuarioId) {
          dispatch(fetchAppointments(usuarioId));
          dispatch(fetchNotificaciones(usuarioId));
          if (typeof usuarioData?.settings?.modoOscuro === 'boolean') {
            dispatch(setModoOscuro(usuarioData.settings.modoOscuro));
          }
        }
      });
    } else if (usuario.id) {
      dispatch(fetchAppointments(usuario.id));
      dispatch(fetchNotificaciones(usuario.id));
      if (typeof usuario.settings?.modoOscuro === 'boolean') {
        dispatch(setModoOscuro(usuario.settings.modoOscuro));
      }
    }
    if (specialities.length === 0) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch, shouldFetch]);

  useEffect(() => {
    (async () => {
      if (usuario && usuario.idioma) await AsyncStorage.setItem('language', usuario.idioma);
      if (usuario && typeof usuario.modoOscuro === 'boolean') {
        await AsyncStorage.setItem('theme', usuario.modoOscuro ? 'dark' : 'light');
      }
    })();
  }, [usuario]);
}