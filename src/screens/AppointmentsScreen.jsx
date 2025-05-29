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

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <AppContainer navigation={navigation} screenTitle="Mis Turnos">
      <ScrollView className="p-5">
        <View className={`rounded-lg p-4 mb-4 shadow-md ${containerClass}`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-semibold ${textClass}`}>
              Mis Turnos
            </Text>
            <FilterButton onPress={() => setShowFilterModal(true)} />
          </View>
          {(startDate || endDate) && (
            <View className="mb-2">
              <Text className="text-blue-600 text-sm">
                Filtrando por: {startDate ? startDate.toLocaleDateString('es-AR') : '-'}
                {endDate ? ` al ${endDate.toLocaleDateString('es-AR')}` : ''}
              </Text>
            </View>
          )}
          <View className="mb-4 flex-row justify-between" style={{ width: '100%' }}>
            <TabButton
              label="Próximos"
              isActive={activeTab === 'upcoming'}
              onPress={() => setActiveTab('upcoming')}
            />
            <TabButton
              label="Pasados"
              isActive={activeTab === 'past'}
              onPress={() => setActiveTab('past')}
            />
            <TabButton
              label="Cancelados"
              isActive={activeTab === 'cancelled'}
              onPress={() => setActiveTab('cancelled')}
            />
          </View>
          {status === 'loading' ? (
            <Text className={`text-sm ${secondaryTextClass}`}>
              Cargando...
            </Text>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
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
              ))
            ) : (
              <Text className={`text-sm ${secondaryTextClass}`}>
                No hay turnos próximos
              </Text>
            )
          ) : activeTab === 'past' ? (
            pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => (
                <View key={appt.id} className="mb-6">
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
                    className="border border-blue-600 rounded-lg p-2 flex-row justify-center"
                    onPress={() => navigation.navigate('MedicalNotes', { appointmentId: appt.id })}
                  >
                    <Text className="text-blue-600 text-sm">
                      Ver notas médicas
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className={`text-sm ${secondaryTextClass}`}>
                No hay turnos pasados
              </Text>
            )
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appt) => (
              <View key={appt.id} className="mb-6">
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
              No hay turnos cancelados
            </Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ width: '90%' }}
            >
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>
                  Filtrar por fechas
                </Text>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: '#1F2937', fontWeight: 'bold', marginBottom: 10 }}>
                    Rango de fechas
                  </Text>

                  <AppointmentsCalendar
                    selectedDate={startDate}
                    endDate={endDate}
                    onSelectDate={handleSelectDate}
                  />

                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
                  >
                    <Text style={{ color: '#2563EB' }}>
                      {startDate
                        ? `Inicio: ${startDate.toLocaleDateString('es-AR')}`
                        : 'Inicio: -'}
                    </Text>
                    <Text style={{ color: '#2563EB' }}>
                      {endDate
                        ? `Fin: ${endDate.toLocaleDateString('es-AR')}`
                        : 'Fin: -'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#2563EB',
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Aplicar filtro
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 10, alignItems: 'center' }}
                  onPress={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                    Limpiar filtro
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Pressable>
      </Modal>
    </AppContainer>
  );
}