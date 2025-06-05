import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchUserByToken, markInitialDataLoaded } from '~/store/slices/userSlice';
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import LoadingOverlay from '~/components/LoadingOverlay';
import HomeScreen from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InitialDataLoader({ navigation }) {
  const dispatch = useDispatch();
  const { professionals } = useSelector((state) => state.professionals);
  const { usuario, initialDataLoaded } = useSelector((state) => state.user);
  const { specialities } = useSelector((state) => state.medicalSpecialities);
  const { appointmentsByUser: appointments } = useSelector((state) => state.appointments);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  useEffect(() => {
    const checkInitialData = async () => {
      // Verificar si initialDataLoaded ya está en true en el store o AsyncStorage
      const storedInitialDataLoaded = await AsyncStorage.getItem('initialDataLoaded');
      if (
        initialDataLoaded ||
        storedInitialDataLoaded === 'true' ||
        (professionals?.length > 0 && specialities?.length > 0 && usuario && appointments)
      ) {
        console.log('Datos ya cargados, omitiendo fetch:', {
          initialDataLoaded,
          storedInitialDataLoaded,
          hasProfessionals: professionals?.length > 0,
          hasSpecialities: specialities?.length > 0,
          hasUsuario: !!usuario,
          hasAppointments: !!appointments,
        });
        setIsLoadingInitialData(false);
        return;
      }

      try {
        const promises = [];

        // Fetch de profesionales si no están cargados
        if (!professionals || professionals.length === 0) {
          console.log('Fetching professionals');
          promises.push(dispatch(fetchProfessionals()));
        }

        // Fetch de usuario si no está cargado
        if (!usuario) {
          console.log('Fetching user by token');
          promises.push(
            dispatch(fetchUserByToken()).then((action) => {
              const usuarioData = action.payload;
              const usuarioId = usuarioData?.id;
              if (usuarioId) {
                console.log('Fetching appointments for user:', usuarioId);
                promises.push(dispatch(fetchAppointments(usuarioId)));
                if (typeof usuarioData?.settings?.modoOscuro === 'boolean') {
                  dispatch({ type: 'user/setModoOscuro', payload: usuarioData.settings.modoOscuro });
                }
                console.log('Modo oscuro establecido desde fetchUserByToken:', usuarioData?.settings?.modoOscuro);
              }
              return action;
            })
          );
        } else if (usuario.id) {
          // Fetch de citas si ya tenemos el usuario
          if (!appointments) {
            console.log('Fetching appointments for existing user:', usuario.id);
            promises.push(dispatch(fetchAppointments(usuario.id)));
          }
          if (typeof usuario.settings?.modoOscuro === 'boolean') {
            dispatch({ type: 'user/setModoOscuro', payload: usuario.settings.modoOscuro });
          }
        }

        // Fetch de especialidades si no están cargadas
        if (!specialities || specialities.length === 0) {
          console.log('Fetching specialities');
          promises.push(dispatch(fetchSpecialities()));
        }

        // Si no hay promesas que ejecutar, marcar como cargado
        if (promises.length === 0) {
          console.log('No hay datos para cargar, marcando como completo');
          setIsLoadingInitialData(false);
          dispatch(markInitialDataLoaded());
          return;
        }

        // Esperar a que todas las promesas se resuelvan
        console.log('Ejecutando promesas:', promises.length);
        await Promise.all(promises.map((promise) => promise.unwrap ? promise.unwrap() : promise));

        // Agregar retraso mínimo para evitar parpadeo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Marcar la carga inicial como completa
        console.log('Marcando carga inicial como completa');
        dispatch(markInitialDataLoaded());
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    checkInitialData();
  }, [dispatch, usuario, professionals, specialities, appointments, initialDataLoaded]);

  // Mostrar solo el LoadingOverlay mientras se cargan los datos
  if (isLoadingInitialData) {
    return <LoadingOverlay />;
  }

  // Renderizar HomeScreen una vez que los datos estén listos
  return <HomeScreen navigation={navigation} />;
}