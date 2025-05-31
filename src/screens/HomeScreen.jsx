import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchUserByToken } from '~/store/slices/userSlice';
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import AppointmentCard from '../components/AppointmentCard';
import DoctorCard from '../components/DoctorCard';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { status: appointmentsStatus } = useSelector((state) => state.appointments);
  const appointments = useSelector((state) => state.appointments.appointmentsByUser);
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const usuario = useSelector((state) => state.user.usuario);
  const specialities = useSelector((state) => state.medicalSpecialities.specialities);


  useEffect(() => {
    if (!professionals || professionals.length === 0) {
      dispatch(fetchProfessionals());
    }
    dispatch(fetchUserByToken()).then((action) => {
      const usuarioId = action.payload?.id;
      if (usuarioId) {
        dispatch(fetchAppointments(usuarioId));
      }
    });
    if (specialities.length === 0) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch]);

  const quickActions = [
    { icon: 'calendar-plus', label: 'Reservar turno', screen: 'BookAppointment' },
    { icon: 'calendar-alt', label: 'Mis Turnos', screen: 'Appointments' },
    { icon: 'file-medical', label: 'Resultados', screen: 'Results' },
    { icon: 'hospital-user', label: 'Obra social', screen: 'Insurance' },
  ];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 23, 59, 59, 999);




  // Ajuste: considerar la zona horaria y formato de fecha
  const upcomingAppointments = (appointments || [])
    .filter((appt) => {
      const apptDate = new Date(appt.fecha);
      return (
        (appt.estado === 'PENDIENTE' || appt.estado === 'CONFIRMADO') &&
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
            Hola, {usuario?.nombre || 'Usuario'}
          </Text>
          <Text className={`text-sm ${secondaryTextClass} mt-1`}>
            ¿Qué necesitas hacer hoy?
          </Text>
          <QuickActions actions={quickActions} navigation={navigation} colorScheme={colorScheme} />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-lg font-semibold ${textClass}`}>
            Tus próximos turnos
          </Text>
          <Text
            className={`text-sm ${linkClass}`}
            onPress={() => navigation.navigate('Appointments')}
          >
            Ver todos
          </Text>
        </View>

        <View className={`rounded-lg p-4 mb-4 shadow-md ${cardClass}`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center px-2">
              {appointmentsStatus === 'loading' ? (
                <Text className={`text-sm ${secondaryTextClass}`}>Cargando...</Text>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appt) => (
                  <View key={appt.id} className="mr-3">
                    <AppointmentCard
                      day={new Date(appt.fecha).toLocaleDateString('es-AR', {
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
                  No hay turnos próximos
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-lg font-semibold ${textClass}`}>
            Profesionales destacados
          </Text>
          <Text
            className={`text-sm ${linkClass}`}
            onPress={() => navigation.navigate('Professionals')}
          >
            Ver todos
          </Text>
        </View>
        <View className={`rounded-lg p-4 pb-1 mb-4 shadow-md ${cardClass}`}>
          <ScrollView horizontal className="mb-4 h-48" showsHorizontalScrollIndicator={false}>
            <View className="flex-row px-2" style={{overflow: 'visible'}}>
              {professionalsStatus === 'loading' ? (
                <Text className={`text-sm ${secondaryTextClass}`}>Cargando...</Text>
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
            Noticias médicas
          </Text>
          <TouchableOpacity
            className={`${primaryButtonClass} rounded-lg py-2 px-4 flex-row justify-center items-center shadow-md`}
            onPress={() => navigation.navigate('HealthTips')}
          >
            <Icon name="heart" size={20} color="#ffffff" className="mr-2" />
            <Text className="text-white text-sm font-semibold">Ver noticias médicas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppContainer>
  );
}

