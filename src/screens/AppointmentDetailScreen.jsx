import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { rescheduleAppointment } from "~/store/slices/appointmentsSlice";
import {useTranslation} from "react-i18next";

// Utilidad para parsear fecha local (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss±hh:mm)
function parseLocalDate(fechaStr) {
  if (!fechaStr) return null;
  // Si ya tiene T y zona, simplemente crea el Date
  if (fechaStr.includes('T')) return new Date(fechaStr);
  // Si solo viene YYYY-MM-DD, parsea como local
  const [year, month, day] = fechaStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function AppointmentDetailScreen({ route, navigation }) {
  console.log('route.params:', route.params);
  console.log('appointment:', appointment);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { status, error } = useSelector((state) => state.appointments);
  const { t, i18n } = useTranslation();

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const labelClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const cardClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const borderClass = colorScheme === 'light' ? 'border-gray-100' : 'border-gray-600';


  const notificacion = route.params?.notificacion;
  const appointment = notificacion?.turno || route.params?.appointment;
  console.log('route.params:', route.params);
  console.log('appointment:', appointment);


  // Navega a la pantalla de reprogramación, pasando los datos del turno y doctor
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
          label: t('appointments.type.Cancelled')
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
  const getStatusConfig = (estado) => {
    switch (estado) {
      case 'CONFIRMADO':
        return {
          icon: 'check-circle',
          bgColor: colorScheme === 'light' ? 'bg-green-100' : 'bg-green-900',
          textColor: colorScheme === 'light' ? 'text-green-800' : 'text-green-200',
          borderColor: colorScheme === 'light' ? 'border-green-200' : 'border-green-700',
          label: 'Confirmado'
        };
      case 'CANCELADO':
        return {
          icon: 'times-circle',
          bgColor: colorScheme === 'light' ? 'bg-red-100' : 'bg-red-900',
          textColor: colorScheme === 'light' ? 'text-red-800' : 'text-red-200',
          borderColor: colorScheme === 'light' ? 'border-red-200' : 'border-red-700',
          label: 'Cancelado'
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
  console.log('statusConfig:', statusConfig);

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
  const handleCancel = () => {
    Alert.alert(
      t('appointments.cancel_button'),
      t('appointments.cancel_confirmation'),
      [
        { text: 'No', style: 'cancel' },
        {
          text: t('global.button.yes'),
          onPress: () => {
            dispatch(cancelAppointment(appointment.id))
              .unwrap()
              .then(() => {
                Alert.alert(t('global.alert.success'), t('appointments.alerts.cancel'));
                navigation.goBack();
              })
              .catch((err) => {
                Alert.alert('Error', err || t('appointments.alerts.cancel_error'));
              });
          },
        },
      ]
    );
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
  return (
    <AppContainer navigation={navigation} screenTitle="Detalle del Turno">
      <ScrollView className={`flex-1 ${containerClass}`}>
        <View className="p-5">
          {/* Cabecera */}
          <View className={`mb-6 ${cardClass} rounded-xl p-4`}>
            <View className="flex-row justify-between items-center">
              <Text className={`text-2xl font-bold ${textClass}`}>
                {t('appointments.medic_book')}
              </Text>

              {/* Badge de estado */}
              <View className={`flex-row items-center ${statusConfig.bgColor} border ${statusConfig.borderColor} px-3 py-2 rounded-full`}>
                <Icon
                  name={statusConfig.icon}
                  size={16}
                  color={colorScheme === 'light' ?
                    (appointment.estado === 'CONFIRMADO' ? '#065f46' : '#991b1b') :
                    (appointment.estado === 'CONFIRMADO' ? '#6ee7b7' : '#fca5a5')}
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
              <Text className={`ml-2 ${labelClass}`}>Fecha y Hora</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {parseLocalDate(appointment.fecha).toLocaleDateString('es-AR', {
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
              <Text className={`ml-2 ${labelClass}`}>Profesional</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {appointment.doctorInfo
                ? `Dr. ${appointment.doctorInfo.nombre} ${appointment.doctorInfo.apellido}`
                : 'Sin asignar'}
            </Text>
            <Text className={`text-base ${textClass}`}>
              {appointment.especialidadInfo?.descripcion || 'Sin especialidad'}
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
              <Text className={`ml-2 ${labelClass}`}>Motivo de la consulta</Text>
            </View>
            <Text className={`text-base ${textClass}`}>
              {appointment.nota || 'Sin motivo especificado'}
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

          {/* Botón de cancelar*/}
          {status === 'loading' ? (
            <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
          ) : appointment.estado === 'CONFIRMADO' ? (
            <View className="flex-row">
              <TouchableOpacity
                className="bg-red-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm mr-2"
                onPress={handleCancel}
              >
                <Icon name="times-circle" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-2">
                  {t('global.button.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm"
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
    </AppContainer>
  );
          {/* Botón de cancelar*/}
          {status === 'loading' ? (
            <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
          ) : appointment.estado === 'CONFIRMADO' ? (
            <View className="flex-row">
              <TouchableOpacity
                className="bg-red-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm mr-2"
                onPress={handleCancel}
              >
                <Icon name="times-circle" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-2">
                  Cancelar turno
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm"
                onPress={handleReschedule}
              >
                <Icon name="calendar-plus" size={20} color="white" />
                <Text className="text-white text-base font-medium ml-2">
                  Reprogramar
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AppContainer>
  );
}


