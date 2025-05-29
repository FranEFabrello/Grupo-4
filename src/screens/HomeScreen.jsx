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

  const handleGoToDetails = (appt) => {
    console.log('Navegando a AppointmentsDetails con id:', appt.id);
    navigation.navigate('AppointmentsDetails', { appointmentId: appt.id });
  };

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
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

  const upcomingAppointments = (appointments || [])
    .filter((appt) => {
      const [year, month, day] = (appt.fecha || appt.date || '').split('-');
      const [hour, minute] = (appt.horaInicio || '00:00').split(':');
      const apptDate = new Date(year, month - 1, day, hour, minute);
      return apptDate >= startOfToday && apptDate < endOfTomorrow;
    })
    .sort((a, b) => {
      const [aYear, aMonth, aDay] = (a.fecha || a.date || '').split('-');
      const [aHour, aMinute] = (a.horaInicio || '00:00').split(':');
      const aDate = new Date(aYear, aMonth - 1, aDay, aHour, aMinute);

      const [bYear, bMonth, bDay] = (b.fecha || b.date || '').split('-');
      const [bHour, bMinute] = (b.horaInicio || '00:00').split(':');
      const bDate = new Date(bYear, bMonth - 1, bDay, bHour, bMinute);

      return aDate - bDate;
    })
    .slice(0, 3);

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardClass = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';

  return (
    <AppContainer navigation={navigation} screenTitle="MediBook">
      <ScrollView className={`p-5 ${containerClass}`}>
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
            <View className="flex-row items-center px-2 h-full">
              {upcomingAppointments.map((appt, idx) => (
                <View key={appt.id || idx} className="mr-3">
                  <AppointmentCard
                    day={new Date(appt.fecha).toLocaleDateString('es', { weekday: 'short' })}
                    time={appt.horaInicio}
                    doctor={`ID: ${appt.doctorId}`}
                    specialty={appt.nota}
                    status={appt.estado || appt.status}
                    onCancel={() => alert('Turno cancelado')}
                    colorScheme={colorScheme}
                    showActions={false}
                    onPress={() => {
                      console.log('onPress ejecutado', appt);
                      handleGoToDetails(appt);
                    }}
                  />
                </View>
              ))}
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
        <View className={`rounded-lg p-4 pb-6 mb-4 shadow-md ${cardClass}`}>
          <ScrollView horizontal className="mb-4 h-48" showsHorizontalScrollIndicator={false}>
            <View className="flex-row px-2">
              {professionalsStatus === 'loading' ? (
                <Text className={`text-sm ${secondaryTextClass}`}>Cargando...</Text>
              ) : professionals.slice(0, 3).map((doctor) => (
                <View key={doctor.id} className="mr-3 mb-4">
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