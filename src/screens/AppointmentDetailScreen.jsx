import React, { useState } from 'react'; // Import useState
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '~/providers/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { rescheduleAppointment, cancelAppointment, fetchAppointments } from "~/store/slices/appointmentsSlice";
import { fetchNotificaciones } from '~/store/slices/notificationSlice';
import { useTranslation } from "react-i18next";
import LoadingOverlay from '~/components/LoadingOverlay'; // Import your LoadingOverlay component
import '../i18n';

function parseLocalDate(fechaStr) {
  if (!fechaStr) return null;
  if (fechaStr.includes('T')) return new Date(fechaStr);
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function AppointmentDetailScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { colorScheme } = useAppTheme();
  const { status, error, appointmentsByUser } = useSelector((state) => state.appointments);
  const usuarioId = useSelector((state) => state.user.usuario?.id);
  const { t, i18n } = useTranslation();
  const [isCancelLoading, setIsCancelLoading] = useState(false); // Add local loading state

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const labelClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const cardClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const borderClass = colorScheme === 'light' ? 'border-gray-100' : 'border-gray-600';

  const notificacion = route.params?.notificacion;
  const appointmentParam = notificacion?.turno || route.params?.appointment;

  // Buscar el turno actualizado en el store por id
  //const appointmentFromStore = useSelector((state) => state.appointments.appointment);
  const appointment = appointmentsByUser.find(a => a.id === appointmentParam?.id);
  if (!appointment) {
    return <LoadingOverlay />; // o algún mensaje
  }


  const handleReschedule = () => {
    navigation.navigate('BookAppointment', {
      reprogramming: true,
      appointmentId: appointment.id,
      professionalId: appointment.doctorInfo?.id,
      specialtyId: appointment.especialidadInfo?.id,
      currentDate: appointment.fecha,
      currentStart: appointment.horaInicio,
      currentEnd: appointment.horaFin,
    });
  };

  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'CONFIRMADO':
        return {
          icon: 'check-circle',
          bgColor: colorScheme === 'light' ? 'bg-green-100' : 'bg-green-900',
          textColor: colorScheme === 'light' ? 'text-green-800' : 'text-green-200',
          borderColor: colorScheme === 'light' ? 'border-green-200' : 'border-green-700',
          label: t('appointments.type.approved')
        };
      case 'CANCELADO':
        return {
          icon: 'times-circle',
          bgColor: colorScheme === 'light' ? 'bg-red-100' : 'bg-red-900',
          textColor: colorScheme === 'light' ? 'text-red-800' : 'text-red-200',
          borderColor: colorScheme === 'light' ? 'border-red-200' : 'border-red-700',
          label: t('appointments.type.cancelled')
        };
      default:
        return {
          icon: 'exclamation-circle',
          bgColor: colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900',
          textColor: colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200',
          borderColor: colorScheme === 'light' ? 'border-gray-200' : 'border-gray-700',
          label: estado
        };
    }
  };

  const statusConfig = getStatusConfig(appointment.estado);

  const handleCancel = () => {
    setIsCancelLoading(true); // Mostrar overlay

    dispatch(cancelAppointment(appointment.id))
      .unwrap()
      .then(async () => {
        await dispatch(fetchAppointmentById(appointment.id));
        setIsCancelLoading(false);
        navigation.navigate('AppointmentsScreen', { cancelled: true });
      })
      .catch((err) => {
        setIsCancelLoading(false);
        //Alert.alert('Error', typeof err === 'string' ? err : (err?.message || t('appointments.alerts.cancel_error')));
      });
  };


  return (
    <AppContainer navigation={navigation} screenTitle={t('appointments.details')}>
      <ScrollView className={`flex-1 ${containerClass}`}>
        <View className="p-5">
          {/* Cabecera */}
          <View className={`mb-6 ${cardClass} rounded-xl p-4`}>
            <View className="flex-row justify-between items-center">
              <Text className={`text-2xl font-bold ${textClass}`}>
                {t('appointments.medic_book')}
              </Text>
              <View className={`flex-row items-center ${statusConfig.bgColor} border ${statusConfig.borderColor} px-3 py-2 rounded-full`}>
                <Icon
                  name={statusConfig.icon}
                  size={16}
                  color={colorScheme === 'light'
                    ? (appointment.estado === 'CONFIRMADO' ? '#065f46' : '#991b1b')
                    : (appointment.estado === 'CONFIRMADO' ? '#6ee7b7' : '#fca5a5')}
                />
                <Text className={`ml-2 font-medium ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Sección de fecha y hora */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="calendar-alt" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>{t('appointments.info.date_time')}</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {parseLocalDate(appointment.fecha).toLocaleDateString(i18n.language, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text className={`text-lg font-medium ${textClass}`}>
              {`${appointment.horaInicio} - ${appointment.horaFin}`}
            </Text>
          </View>

          {/* Sección del profesional */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="user-md" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>{t('appointments.info.professional')}</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {appointment.doctorInfo
                ? `Dr. ${appointment.doctorInfo.nombre} ${appointment.doctorInfo.apellido}`
                : t('appointments.alerts.no_assign')}
            </Text>
            <Text className={`text-base ${textClass}`}>
              {appointment.especialidadInfo?.descripcion || t('professionals.alerts.no_especiality')}
            </Text>
          </View>

          {/* Motivo de la consulta */}
          <View className={`mb-6 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="comment-medical" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>{t('medical_note.reason')}</Text>
            </View>
            <Text className={`text-base ${textClass}`}>
              {appointment.nota || t('medical_note.no_reason')}
            </Text>
          </View>

          {/* Botón de cancelar y reprogramar */}
          {status === 'loading' || isCancelLoading ? (
            <LoadingOverlay /> // Show LoadingOverlay when canceling
          ) : appointment.estado === 'CONFIRMADO' ? (
            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-red-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm mr-2"
                onPress={handleCancel}
              >
                <Icon name="times-circle" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-2">
                  {t('global.button.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm"
                onPress={handleReschedule}
              >
                <Icon name="calendar-plus" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-2">
                  {t('appointments.reschedule')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
      {isCancelLoading && <LoadingOverlay />}
    </AppContainer>
  );
}

