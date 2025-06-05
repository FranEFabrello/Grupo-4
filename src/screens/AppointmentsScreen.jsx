import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import AppContainer from '../components/AppContainer';
import FilterButton from '../components/FilterButton';
import TabButton from '../components/TabButton';
import AppointmentsCalendar from '~/components/AppointmentsCalendar';
import { useColorScheme } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import AppointmentCardFullWidth from '~/components/ApptCardForApptScreen';

// Utilidad para obtener un Date con la hora deseada
function getDateWithTime(fecha, hora) {
  if (!fecha) return null;
  const d = new Date(fecha);
  if (hora) {
    const [h, m] = hora.split(":");
    d.setHours(Number(h), Number(m), 0, 0);
  }
  return d;
}

export default function AppointmentsScreen({ navigation }) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { status } = useSelector((state) => state.appointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const appointments = useSelector((state) => state.appointments.appointmentsByUser);
  const usuarioId = useSelector((state) => state.user.usuario?.id);
  const { t, i18n } = useTranslation();

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchAppointments(usuarioId));
    }
  }, [dispatch, usuarioId]);

  const handleSelectDate = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  };

  const filterByDateRange = (list) => {
    if (!startDate && !endDate) return list;
    return list.filter((appt) => {
      const apptDate = new Date(appt.fecha);
      if (isNaN(apptDate)) return false;
      if (startDate && apptDate < startDate) return false;
      if (endDate && apptDate > endDate) return false;
      return true;
    });
  };

  const upcomingAppointments = filterByDateRange(
    (appointments || []).filter((appt) => {
      if (appt.estado !== 'PENDIENTE' && appt.estado !== 'CONFIRMADO') return false;
      if (!appt.horaInicio) return false;
      const apptDateTime = getDateWithTime(appt.fecha, appt.horaInicio);
      if (isNaN(apptDateTime)) return false;
      return apptDateTime.getTime() >= Date.now() && appt.cuentaActiva;
    })
  ).sort((a, b) => getDateWithTime(a.fecha, a.horaInicio) - getDateWithTime(b.fecha, b.horaInicio));

  const pastAppointments = filterByDateRange(
    (appointments || []).filter((appt) => {
      if (!appt.horaFin) return false;
      const apptEndDateTime = getDateWithTime(appt.fecha, appt.horaFin);
      if (isNaN(apptEndDateTime)) return false;
      return apptEndDateTime.getTime() <= Date.now();
    })
  ).sort((a, b) => getDateWithTime(b.fecha, b.horaInicio) - getDateWithTime(a.fecha, a.horaInicio));

  const cancelledAppointments = filterByDateRange(
    (appointments || []).filter((appt) => {
      return appt.estado === 'CANCELADO' && appt.cuentaActiva;
    })
  ).sort((a, b) => getDateWithTime(b.fecha, b.horaInicio) - getDateWithTime(a.fecha, a.horaInicio));

  // ==================== CLASES COMPLETAS ====================
  // Contenedores
  const screenContainerClass = "flex-1 bg-transparent"; // Respeta el fondo de la app
  const scrollContainerClass = "p-5 bg-transparent";
  const contentContainerClass = colorScheme === 'light'
    ? 'bg-white border border-gray-200 shadow-md'
    : 'bg-gray-700 border border-gray-600 shadow-lg';

  // Textos
  const textPrimaryClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const textSecondaryClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const textAccentClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const textWhiteClass = 'text-white';


  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const selectedButtonText = colorScheme === 'light' ? 'text-white' : 'text-gray-200';


  // Botones
  const buttonPrimaryClass = colorScheme === 'light'
    ? 'bg-blue-600'
    : 'bg-blue-500';

  const buttonSecondaryClass = colorScheme === 'light'
    ? 'border border-blue-600 bg-transparent'
    : 'border border-blue-400 bg-transparent';

  // Modal
  const modalOverlayClass = 'flex-1 bg-black/50 justify-center items-center';

  const modalContainerClass = colorScheme === 'light'
    ? 'bg-white rounded-xl p-6 w-[90%]'
    : 'bg-gray-700 rounded-xl p-6 w-[90%]';


  return (
    <AppContainer navigation={navigation} screenTitle={t('appointments.Mytitle')} className={screenContainerClass}>
      <ScrollView className={scrollContainerClass}>
        {/* Contenedor principal */}
        <View className={`rounded-lg p-4 mb-4 ${contentContainerClass}`}>

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-semibold ${textPrimaryClass}`}>{t('appointments.Mytitle')}</Text>
            <FilterButton
              onPress={() => setShowFilterModal(true)}
              className={`${selectedButtonBg} rounded-full px-4 py-2.5 ml-2 flex-row items-center`}
              textClassName={`${selectedButtonText} font-semibold text-sm`}
              iconColor="#FFFFFF"
            />
          </View>

          {/* Filtro activo */}
          {(startDate || endDate) && (
            <View className="mb-2">
              <Text className={`text-sm ${textAccentClass}`}>
                Filtrando por: {startDate ? startDate.toLocaleDateString(i18n.language) : '-'}
                {endDate ? t('filter.till') + ' ' + endDate.toLocaleDateString(i18n.language) : ''}
              </Text>
            </View>
          )}

          {/* Pestañas */}
          <View className="mb-4 flex-row justify-between" style={{ width: '100%' }}>
            <TabButton
              label={t('appointments.tabs.upcoming')}
              isActive={activeTab === 'upcoming'}
              onPress={() => setActiveTab('upcoming')}
              colorScheme={colorScheme}
            />
            <TabButton
              label={t('appointments.tabs.past')}
              isActive={activeTab === 'past'}
              onPress={() => setActiveTab('past')}
              colorScheme={colorScheme}
            />
            <TabButton
              label={t('appointments.tabs.cancelled')}
              isActive={activeTab === 'cancelled'}
              onPress={() => setActiveTab('cancelled')}
              colorScheme={colorScheme}
            />
          </View>

          {/* Contenido dinámico */}
          {status === 'loading' ? (
            <Text className={`text-sm ${textSecondaryClass}`}>{t('global.alert.loading')}</Text>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <View key={appt.id} className="mb-4">
                  <AppointmentCardFullWidth
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
              <Text className={`text-sm ${textSecondaryClass}`}>{t('appointments.alerts.no_upcoming')}</Text>
            )
          ) : activeTab === 'past' ? (
            pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => (
                <View key={appt.id} className="mb-4">
                  <AppointmentCardFullWidth
                    day={new Date(appt.fecha).toLocaleDateString(i18n.language, {
                      day: 'numeric',
                      month: 'short',
                    })}
                    time={`${appt.horaInicio} - ${appt.horaFin}`}
                    doctor={`${appt.doctorInfo.nombre} ${appt.doctorInfo.apellido}`}
                    specialty={appt.especialidadInfo.descripcion}
                    status={appt.estado}
                    onPress={() => navigation.navigate('MedicalNotes', { appointment: appt })}
                    colorScheme={colorScheme}
                  />
                </View>
              ))
            ) : (
              <Text className={`text-sm ${textSecondaryClass}`}>{t('appointments.alerts.no_past')}</Text>
            )
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appt) => (
              <View key={appt.id} className="mb-4">
                <AppointmentCardFullWidth
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
            <Text className={`text-sm ${textSecondaryClass}`}>{t('appointments.alerts.no_cancelled')}</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de filtro */}
      {showFilterModal && (
        <BlurView intensity={50} tint="dark" className="flex-1 justify-center items-center" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowFilterModal(false)}
          >
            <Pressable onPress={Keyboard.dismiss} className={modalOverlayClass} style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="w-full items-center"
              >
                <View className={modalContainerClass}>
                  <Text className={`text-lg font-bold mb-5 ${textPrimaryClass}`}>
                    {t('filter.filter_dates.filter_by_date')}
                  </Text>
                  <AppointmentsCalendar
                    selectedDate={startDate}
                    endDate={endDate}
                    onSelectDate={handleSelectDate}
                    colorScheme={colorScheme}
                  />

                  <View className="flex-row justify-between mt-3">
                    <Text className={textAccentClass}>
                      {startDate
                        ? `${t('filter.filter_dates.start')}: ${startDate.toLocaleDateString(i18n.language)}`
                        : `${t('filter.filter_dates.start')}: -`}
                    </Text>
                    <Text className={textAccentClass}>
                      {endDate
                        ? `${t('filter.filter_dates.end')}: ${endDate.toLocaleDateString(i18n.language)}`
                        : `${t('filter.filter_dates.end')}: -`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className={`${buttonPrimaryClass} py-3 rounded-lg mt-5 items-center`}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <Text className={`text-base font-bold ${textWhiteClass}`}>{t('filter.filter_dates.apply')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="mt-3 items-center"
                    onPress={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setShowFilterModal(false);
                    }}
                  >
                    <Text className={`text-sm font-bold ${textAccentClass}`}>{t('filter.filter_dates.clear')}</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Pressable>
          </Modal>
        </BlurView>
      )}
    </AppContainer>
  );
}
