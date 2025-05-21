import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from "~/store/slices/professionalsSlice";
import AppContainer from '../components/AppContainer';
import QuickActions from '../components/QuickActions';
import AppointmentCard from '../components/AppointmentCard';
import DoctorCard from '../components/DoctorCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { obtenerUsuarioPorId } from "~/store/slices/userSlice";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { appointments, status: appointmentsStatus } = useSelector((state) => state.appointments);
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const { profile } = useSelector((state) => state.profile);

  const usuario = useSelector((state) => state.user.usuario);
  const usuarioId = usuario?.id;

  useEffect(() => {
    dispatch(fetchProfessionals());

    console.log("Id del usuario -> ", usuarioId);
    if (usuarioId) {
      dispatch(obtenerUsuarioPorId(usuarioId));
    }
  }, [dispatch]);

  const quickActions = [
    { icon: 'calendar-plus', label: 'Reservar turno', screen: 'BookAppointment' },
    { icon: 'calendar-alt', label: 'Mis Turnos', screen: 'Appointments' },
    { icon: 'file-medical', label: 'Resultados', screen: 'Results' },
    { icon: 'hospital-user', label: 'Obra social', screen: 'Insurance' },
  ];

  //const nextAppointment = appointments.find((appt) => new Date(appt.date) >= new Date());
  const nextAppointment = null;
  return (
    <AppContainer navigation={navigation} screenTitle="MediBook">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800">
            Hola, {profile?.name || 'Usuario'}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">¿Qué necesitas hacer hoy?</Text>
          <QuickActions actions={quickActions} navigation={navigation} />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Tu próximo turno</Text>
          <Text className="text-sm text-blue-600" onPress={() => navigation.navigate('Appointments')}>
            Ver todos
          </Text>
        </View>
        {appointmentsStatus === 'loading' ? (
          <Text className="text-sm text-gray-600 mb-4">Cargando...</Text>
        ) : nextAppointment ? (
          <AppointmentCard
            day={new Date(nextAppointment.date).toLocaleDateString('es', { weekday: 'short' })}
            time={nextAppointment.time}
            doctor={nextAppointment.doctor}
            specialty={nextAppointment.specialty}
            location={nextAppointment.location}
            onCancel={() => alert('Turno cancelado')}
          />
        ) : (
          <Text className="text-sm text-gray-600 mb-4">No hay turnos próximos</Text>
        )}

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Profesionales destacados</Text>
          <Text className="text-sm text-blue-600" onPress={() => navigation.navigate('Professionals')}>
            Ver todos
          </Text>
        </View>
        <ScrollView horizontal className="mb-4" showsHorizontalScrollIndicator={false}>
          <View className="flex-row px-2">
            {professionalsStatus === 'loading' ? (
              <Text className="text-sm text-gray-600">Cargando...</Text>
            ) : professionals.slice(0, 3).map((doctor) => (
              <View key={doctor.id} className="mr-3">
                <DoctorCard
                  name={`${doctor.nombre} ${doctor.apellido}`}
                  specialty={doctor.informacionAdicional}
                  onBook={() => navigation.navigate('BookAppointment', { professionalId: doctor.id })}
                  containerClassName="w-64"
                />
              </View>
            ))}
          </View>
        </ScrollView>



        <View className="bg-white rounded-lg p-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Noticias médicas</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-2 px-4 flex-row justify-center items-center shadow-md"
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