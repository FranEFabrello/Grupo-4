import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { cancelAppointment } from '~/store/slices/appointmentsSlice';

export default function AppointmentDetailScreen({ route, navigation }) {
  const { appointment } = route.params;
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { status, error } = useSelector((state) => state.appointments);

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';

  const handleCancel = () => {
    Alert.alert(
      'Confirmar Cancelación',
      '¿Estás seguro de que deseas cancelar este turno?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            dispatch(cancelAppointment(appointment.id))
              .unwrap()
              .then(() => {
                Alert.alert('Éxito', 'El turno ha sido cancelado.');
                navigation.goBack();
              })
              .catch((err) => {
                Alert.alert('Error', err || 'No se pudo cancelar el turno.');
              });
          },
        },
      ]
    );
  };

  return (
    <AppContainer navigation={navigation} screenTitle="Detalle del Turno">
      <ScrollView className="p-5">
        <View className={`rounded-lg p-6 shadow-md ${containerClass}`}>
          <Text className={`text-2xl font-bold mb-4 ${textClass}`}>
            Detalle del Turno
          </Text>

          <View className="mb-4">
            <Text className={secondaryTextClass}>Fecha</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {new Date(appointment.fecha).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View className="mb-4">
            <Text className={secondaryTextClass}>Hora</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {`${appointment.horaInicio} - ${appointment.horaFin}`}
            </Text>
          </View>

          <View className="mb-4">
            <Text className={secondaryTextClass}>Doctor</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {appointment.doctorInfo
                ? `${appointment.doctorInfo.nombre} ${appointment.doctorInfo.apellido}`
                : 'Sin doctor'}
            </Text>
          </View>

          <View className="mb-4">
            <Text className={secondaryTextClass}>Especialidad</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {appointment.especialidadInfo?.descripcion || 'Sin especialidad'}
            </Text>
          </View>

          <View className="mb-6">
            <Text className={secondaryTextClass}>Nota</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {appointment.nota || 'Sin nota'}
            </Text>
          </View>

          <View className="mb-6">
            <Text className={secondaryTextClass}>Estado</Text>
            <Text className={`text-lg font-semibold ${textClass}`}>
              {appointment.estado}
            </Text>
          </View>

          {status === 'loading' ? (
            <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
          ) : appointment.estado === 'PENDIENTE' || appointment.estado === 'CONFIRMADO' ? (
            <TouchableOpacity
              className="bg-red-600 rounded-lg p-4 flex-row justify-center items-center"
              onPress={handleCancel}
            >
              <Icon name="times" size={16} color="white" />
              <Text className="text-white text-base ml-2">Cancelar turno</Text>
            </TouchableOpacity>
          ) : (
            <Text className={`text-sm ${secondaryTextClass}`}>
              Este turno ya está {appointment.estado.toLowerCase()}.
            </Text>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}