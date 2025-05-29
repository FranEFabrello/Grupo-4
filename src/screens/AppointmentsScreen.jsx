import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '~/store/slices/appointmentsSlice';
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import TabButton from '../components/TabButton';
import AppointmentsCalendar from '~/components/AppointmentsCalendar';
import { useColorScheme } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function AppointmentsScreen({ navigation }) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const { status } = useSelector((state) => state.appointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const appointments = useSelector((state) => state.appointments.appointmentsByUser);
  const usuarioId = useSelector((state) => state.user.usuario?.id);

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
      const apptDate = new Date(appt.fecha);
      if (isNaN(apptDate)) return false;
      const today = new Date();
      apptDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return apptDate.getTime() >= today.getTime() && appt.cuentaActiva;
    })
  ).sort((a, b) => new Date(a.fecha + 'T' + a.horaInicio) - new Date(b.fecha + 'T' + b.horaInicio));

  const pastAppointments = filterByDateRange(
    (appointments || []).filter((appt) => {
      if (appt.estado !== 'CONFIRMADO') return false;
      const apptDate = new Date(appt.fecha);
      if (isNaN(apptDate)) return false;
      const today = new Date();
      apptDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (apptDate.getTime() < today.getTime()) return true;
      if (apptDate.getTime() === today.getTime() && appt.horaFin) {
        const [finHour, finMin] = appt.horaFin.split(':').map(Number);
        const finDate = new Date(appt.fecha);
        finDate.setHours(finHour, finMin, 0, 0);
        return finDate.getTime() <= Date.now();
      }
      return false;
    })
  ).sort((a, b) => new Date(b.fecha + 'T' + b.horaInicio) - new Date(a.fecha + 'T' + a.horaInicio));

  const cancelledAppointments = filterByDateRange(
    (appointments || []).filter((appt) => appt.estado === 'CANCELADO' && appt.cuentaActiva)
  ).sort((a, b) => new Date(b.fecha + 'T' + b.horaInicio) - new Date(a.fecha + 'T' + a.horaInicio));

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
    : 'bg-gray-800 rounded-xl p-6 w-[90%]';



  return (
    <AppContainer navigation={navigation} screenTitle="Mis Turnos" className={screenContainerClass}>
      <ScrollView className={scrollContainerClass}>
        {/* Contenedor principal */}
        <View className={`rounded-lg p-4 mb-4 ${contentContainerClass}`}>

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-semibold ${textPrimaryClass}`}>Mis Turnos</Text>
            <FilterButton onPress={() => setShowFilterModal(true)} />
          </View>

          {/* Filtro activo */}
          {(startDate || endDate) && (
            <View className="mb-2">
              <Text className={`text-sm ${textAccentClass}`}>
                Filtrando por: {startDate ? startDate.toLocaleDateString('es-AR') : '-'}
                {endDate ? ` al ${endDate.toLocaleDateString('es-AR')}` : ''}
              </Text>
            </View>
          )}

          {/* Pestañas */}
          <View className="mb-4 flex-row justify-between" style={{ width: '100%' }}>
            <TabButton
              label="Próximos"
              isActive={activeTab === 'upcoming'}
              onPress={() => setActiveTab('upcoming')}
              colorScheme={colorScheme}
            />
            <TabButton
              label="Pasados"
              isActive={activeTab === 'past'}
              onPress={() => setActiveTab('past')}
              colorScheme={colorScheme}
            />
            <TabButton
              label="Cancelados"
              isActive={activeTab === 'cancelled'}
              onPress={() => setActiveTab('cancelled')}
              colorScheme={colorScheme}
            />
          </View>

          {/* Contenido dinámico */}
          {status === 'loading' ? (
            <Text className={`text-sm ${textSecondaryClass}`}>Cargando...</Text>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <View key={appt.id} className="mb-4">
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
              <Text className={`text-sm ${textSecondaryClass}`}>No hay turnos próximos</Text>
            )
          ) : activeTab === 'past' ? (
            pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => (
                <View key={appt.id} className="mb-4">
                  <AppointmentCard
                    day={new Date(appt.fecha).toLocaleDateString('es-AR', {
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
                  <TouchableOpacity
                    className={`${buttonSecondaryClass} rounded-lg p-2 mt-2`}
                    onPress={() => navigation.navigate('MedicalNotes', { appointmentId: appt.id })}
                  >
                    <Text className={`text-sm ${textAccentClass}`}>
                      Ver notas médicas
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className={`text-sm ${textSecondaryClass}`}>No hay turnos pasados</Text>
            )
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appt) => (
              <View key={appt.id} className="mb-4">
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
            <Text className={`text-sm ${textSecondaryClass}`}>No hay turnos cancelados</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de filtro */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable onPress={Keyboard.dismiss} className={modalOverlayClass}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full items-center"
          >
            <View className={modalContainerClass}>
              <Text className={`text-lg font-bold mb-5 ${textPrimaryClass}`}>
                Filtrar por fechas
              </Text>

              <AppointmentsCalendar
                selectedDate={startDate}
                endDate={endDate}
                onSelectDate={handleSelectDate}
                colorScheme={colorScheme}
              />

              <View className="flex-row justify-between mt-3">
                <Text className={textAccentClass}>
                  {startDate ? `Inicio: ${startDate.toLocaleDateString('es-AR')}` : 'Inicio: -'}
                </Text>
                <Text className={textAccentClass}>
                  {endDate ? `Fin: ${endDate.toLocaleDateString('es-AR')}` : 'Fin: -'}
                </Text>
              </View>

              <TouchableOpacity
                className={`${buttonPrimaryClass} py-3 rounded-lg mt-5 items-center`}
                onPress={() => setShowFilterModal(false)}
              >
                <Text className={`text-base font-bold ${textWhiteClass}`}>Aplicar filtro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-3 items-center"
                onPress={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setShowFilterModal(false);
                }}
              >
                <Text className={`text-sm font-bold ${textAccentClass}`}>Limpiar filtro</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </AppContainer>
  );
}