import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchUserByToken } from "~/store/slices/userSlice";
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import AppointmentCard from '../components/AppointmentCard';
import DoctorCard from '../components/DoctorCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TestToastButton from "~/components/TestToastButton";
import { useAppTheme} from "~/providers/ThemeProvider";
import { fetchNotificaciones } from "~/store/slices/notificationSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colorScheme } = useAppTheme();
  const { status: appointmentsStatus } = useSelector((state) => state.appointments);
  const appointments = useSelector((state) => state.appointments.appointmentsByUser);
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const usuario = useSelector((state) => state.user.usuario);
  const specialities = useSelector((state) => state.medicalSpecialities.specialities);
  const { t,i18n } = useTranslation();


  useEffect(() => {
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
            dispatch({ type: 'user/setModoOscuro', payload: usuarioData.settings.modoOscuro });
          }
          console.log('Modo oscuro establecido desde fetchUserByToken:', usuarioData?.settings?.modoOscuro);
        }
      });
    } else if (usuario.id) {
      dispatch(fetchAppointments(usuario.id));
      dispatch(fetchNotificaciones(usuario.id));
      if (typeof usuario.settings?.modoOscuro === 'boolean') {
        dispatch({ type: 'user/setModoOscuro', payload: usuario.settings.modoOscuro });
      }
    }
    if (specialities.length === 0) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch, usuario]);

  // Sincroniza idioma y tema con AsyncStorage cuando cambia el usuario
  useEffect(() => {
    (async () => {
      if (usuario && usuario.idioma) await AsyncStorage.setItem('language', usuario.idioma);
      if (usuario && typeof usuario.modoOscuro === 'boolean') {
        await AsyncStorage.setItem('theme', usuario.modoOscuro ? 'dark' : 'light');
      }
    })();
  }, [usuario]);


  const quickActions = [
    { icon: 'calendar-plus', label: t('book_appointment.title'), screen: 'BookAppointment' },
    { icon: 'calendar-alt', label: t('appointments.my_appointments'), screen: 'Appointments' },
    { icon: 'file-medical', label: t('home.quick_actions.results'), screen: 'Results' },
    { icon: 'hospital-user', label: t('home.quick_actions.insurance'), screen: 'Insurance' },
  ];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 23, 59, 59, 999);

  // Ajuste: considerar la zona horaria y formato de fecha
  const upcomingAppointments = (appointments || [])
    .filter((appt) => {
      const apptDate = new Date(appt.fecha);
      return (
        (appt.estado === 'CONFIRMADO') &&
        apptDate >= startOfToday &&
        apptDate < endOfWeek &&
        appt.cuentaActiva
      );
    })
    .sort((a, b) => new Date(a.fecha + 'T' + a.horaInicio) - new Date(b.fecha + 'T' + b.horaInicio))
    .slice(0,3);

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardClass = colorScheme === 'light' ? 'bg-blue-50' : 'bg-gray-700';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';



  return (
    <AppContainer navigation={navigation} screenTitle="MediBook">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 64 }} className={containerClass}>
        <View className={`rounded-lg p-4 mb-4 shadow-md ${cardClass}`}>
          <Text className={`text-lg font-semibold ${textClass}`}>
            {t('home.greeting', { name: usuario?.nombre || 'Usuario' })}
          </Text>
          <Text className={`text-sm ${secondaryTextClass} mt-1`}>
            {t('home.question')}
          </Text>
          <QuickActions actions={quickActions} navigation={navigation} colorScheme={colorScheme} />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-lg font-semibold ${textClass}`}>
            {t('home.next_appointment.ur_next_appointment')}
          </Text>
          <Text
            className={`text-sm ${linkClass}`}
            onPress={() => navigation.navigate('Appointments')}
          >
            {t('home.next_appointment.view_all')}
          </Text>
        </View>

        <View className={`rounded-lg p-4 mb-4 shadow-md ${cardClass}`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center px-2">
              {appointmentsStatus === 'loading' ? (
                <Text className={`text-sm ${secondaryTextClass}`}>{t('global.alert.loading')}</Text>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <View key={appt.id} className="mr-3">
                    <AppointmentCard
                      day={new Date(appt.fecha).toLocaleDateString(i18n.language, {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      time={`${appt.horaInicio} - ${appt.horaFin}`}
                      doctor={`${appt.doctorInfo.nombre} ${appt.doctorInfo.apellido}`}
                      specialty={appt.especialidadInfo.descripcion}
                      status={appt.estado}
                      onPress={() => navigation.navigate('AppointmentDetail', { appointment: appt })}
                      colorScheme={colorScheme}
                    />
                  </View>
                ))
              ) : (
                <Text className={`text-sm ${secondaryTextClass}`}>
                  {t('appointments.alerts.no_upcoming')}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-lg font-semibold ${textClass}`}>
            {t('home.featured_doctors.title')}
          </Text>
          <Text
            className={`text-sm ${linkClass}`}
            onPress={() => navigation.navigate('Professionals')}
          >
            {t('home.featured_doctors.view_all')}
          </Text>
        </View>
        <View className={`rounded-lg p-4 pb-1 mb-4 shadow-md ${cardClass}`}>
          <ScrollView horizontal className="mb-4 h-48" showsHorizontalScrollIndicator={false}>
            <View className="flex-row px-2" style={{overflow: 'visible'}}>
              {professionalsStatus === 'loading' ? (
                <Text className={`text-sm ${secondaryTextClass}`}>{t('global.alert.loading')}</Text>
              ) : professionals.slice(0, 3).map((doctor) => (
                <View key={doctor.id} className="mr-3">
                  <DoctorCard
                    name={`${doctor.nombre} ${doctor.apellido}`}
                    specialty={
                      specialities.find((s) => s.id === doctor.idEspecialidad)?.descripcion || ''
                    }
                    stars={doctor.calificacionPromedio > 0 ? doctor.calificacionPromedio : null}
                    noRating={doctor.calificacionPromedio === 0}
                    onBook={() =>
                      navigation.navigate('BookAppointment', { professionalId: doctor.id })
                    }
                    containerClassName="w-64"
                    colorScheme={colorScheme}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className={`rounded-lg p-4 shadow-md ${cardClass}`}>
          <Text className={`text-lg font-semibold ${textClass} mb-3`}>
            {t('home.medical_news.title')}
          </Text>
          <TouchableOpacity
            className={`${primaryButtonClass} rounded-lg py-2 px-4 flex-row justify-center items-center shadow-md`}
            onPress={() => navigation.navigate('HealthTips')}
          >
            <Icon name="heart" size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white text-sm font-semibold">{t('home.medical_news.title')}</Text>
          </TouchableOpacity>

          {/*<TestToastButton />*/}

        </View>
      </ScrollView>
    </AppContainer>
  );
}