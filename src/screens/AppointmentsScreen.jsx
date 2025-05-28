import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';import { useColorScheme } from 'react-native';
import { confirmAppointment, fetchAppointments } from "~/store/slices/appointmentsSlice";
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import TabButton from '../components/TabButton';
import Calendar from '../components/Calendar';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AppointmentsCalendar from "~/components/AppointmentsCalendar";
import { useTranslation } from 'react-i18next';


export default function AppointmentsScreen({ navigation }) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme(); // Detecta el tema del sistema
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.appointments);
  const [activeTab, setActiveTab] = useState('upcoming');
  const appointments = useSelector((state) => state.appointments.appointmentsByUser);
  const usuarioId = useSelector((state) => state.user.usuario?.id);

  //console.log("Turnos traido desde la pantalla usuario: ",appointments)

  // Estado para el modal de filtros por fecha
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchAppointments(usuarioId));
    }
  }, [dispatch, usuarioId]);

  // Filtrado por rango de fechas si hay filtro activo
  const filterByDateRange = (list) => {
    if (!startDate && !endDate) return list;
    return list.filter((appt) => {
      const apptDate = new Date(appt.date);
      if (startDate && apptDate < startDate) return false;
      return !(endDate && apptDate > endDate);

    });
  };

  // Lógica para seleccionar rango en el calendario
  const handleSelectDate = (date) => {
    console.log('Fecha seleccionada en el calendario:', date);
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      console.log('Nuevo rango:', { startDate: date, endDate: null });
    } else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
      console.log('Nuevo rango:', { startDate: date, endDate: null });
    } else {
      setEndDate(date);
      console.log('Nuevo rango:', { startDate, endDate: date });
    }
  };

  const upcomingAppointments = (appointments || [])
    .filter((appt) => {
      // Filtra por estado y fecha futura
      if (appt.estado !== 'PENDIENTE' && appt.estado !== 'CONFIRMADO') {
        return false;
      }
      const apptDate = new Date(appt.fecha);
      const today = new Date();
      apptDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return !isNaN(apptDate) && apptDate.getTime() >= today.getTime();
    })
    .filter((appt) => {
      // Aplica el filtro de rango de fechas (AND)
      if (!startDate && !endDate) return true;
      const apptDate = new Date(appt.fecha);
      if (startDate && apptDate < startDate) return false;
      if (endDate && apptDate > endDate) return false;
      return true;
    });

  console.log('upcomingAppointments', upcomingAppointments);

  const pastAppointments = (appointments || [])
    .filter((appt) => {
      // Filtra por estado confirmado y fecha/hora pasada
      if (appt.estado !== 'CONFIRMADO') {
        return false;
      }
      const apptDate = new Date(appt.fecha);
      const today = new Date();
      apptDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // Si la fecha es anterior a hoy, es pasado
      if (!isNaN(apptDate) && apptDate.getTime() < today.getTime()) {
        return true;
      }

      // Si la fecha es hoy, comparar hora fin
      if (!isNaN(apptDate) && apptDate.getTime() === today.getTime()) {
        if (appt.horaFin) {
          const [finHour, finMin] = appt.horaFin.split(':').map(Number);
          const finDate = new Date(appt.fecha);
          finDate.setHours(finHour, finMin, 0, 0);
          return finDate.getTime() <= Date.now();
        }
      }
      return false;
    })
    .filter((appt) => {
      // Aplica el filtro de rango de fechas (AND)
      if (!startDate && !endDate) return true;
      const apptDate = new Date(appt.fecha);
      if (startDate && apptDate < startDate) return false;
      if (endDate && apptDate > endDate) return false;
      return true;
    });

  const cancelledAppointments = (appointments || [])
    .filter((appt) => appt.estado === 'CANCELADO')
    .filter((appt) => {
      // Aplica el filtro de rango de fechas (AND)
      if (!startDate && !endDate) return true;
      const apptDate = new Date(appt.fecha);
      if (startDate && apptDate < startDate) return false;
      if (endDate && apptDate > endDate) return false;
      return true;
    });

  // Definir clases condicionales basadas en colorScheme
  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'; // Card background
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200'; // Main text color
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400'; // Secondary text color
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700'; // Primary button background
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400'; // Link text color



  return (
    <AppContainer navigation={navigation} screenTitle={t('appointments.title')}>
      <ScrollView className={`p-5 ${containerClass}`}>
        <View className={`rounded-lg p-4 mb-4 shadow-md ${cardClass}`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-semibold ${textClass}`}>{t('appointments.title')}</Text>
            <FilterButton onPress={() => setShowFilterModal(true)} />
          </View>
          {(startDate || endDate) && (
            <View className="mb-2">
              <Text className="text-blue-600 text-sm">
                {`Filtrando por: ${startDate ? startDate.toLocaleDateString('es') : '-'}${endDate ? ' al ' + endDate.toLocaleDateString('es') : ''}`}
              </Text>
            </View>
          )}
          <View className="mb-4 flex-row justify-between" style={{ width: '100%' }}>
            <TabButton
              label="Próximos"
              isActive={activeTab === 'upcoming'}
              colorScheme={colorScheme}
              onPress={() => setActiveTab('upcoming')}
            />
            <TabButton
              label="Pasados"
              isActive={activeTab === 'past'}
              colorScheme={colorScheme}
              onPress={() => setActiveTab('past')}
            />
            <TabButton
              label="Cancelados"
              isActive={activeTab === 'cancelled'}
              onPress={() => setActiveTab('cancelled')}
              colorScheme={colorScheme}
            />
          </View>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">{t('appointments.loading')}</Text>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt, index) => (
                <AppointmentCard
                  key={index}
                  day={new Date(appt.fecha).toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' })}
                  time={`${appt.horaInicio} - ${appt.horaFin}`}
                  doctor={
                    appt.doctorInfo
                      ? `${appt.doctorInfo.nombre} ${appt.doctorInfo.apellido}`
                      : appt.doctorNombre
                        ? appt.doctorNombre
                        : appt.doctorId
                          ? `Dr. ${appt.doctorId}`
                          : ''
                  }
                  specialty={appt.especialidadInfo?.descripcion || ''}
                  status={appt.estado}
                  onCancel={() => alert(t('appointments.cancel_alert'))}
                  onConfirm={appt.estado === 'PENDIENTE' ? () => dispatch(confirmAppointment(appt.id)) : undefined}
                  colorScheme={colorScheme}
                />
              ))
            ) : (
              <Text className="text-sm text-gray-600">{t('appointments.no_upcoming')}</Text>
            )
          ) : activeTab === 'past' ? (
            pastAppointments.length > 0 ? (
              pastAppointments.map((appt, index) => (
                <View key={index} className="mb-6">
                  <AppointmentCard
                    day={new Date(appt.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                    time={`${appt.horaInicio} - ${appt.horaFin}`}
                    doctor={appt.doctorNombre ? appt.doctorNombre : appt.doctorId ? `Dr. ${appt.doctorId}` : ''}
                    specialty={appt.especialidad || appt.specialty || ''}
                    status={appt.estado}
                    colorScheme={colorScheme}
                  />
                  <TouchableOpacity
                    className="border border-blue-600 rounded-lg p-2 flex-row justify-center"
                    onPress={() => navigation.navigate('MedicalNotes', { appointmentId: appt.id })}
                  >
                    <Text className="text-blue-600 text-sm">{t('appointments.view_medical_notes')}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-600">{t('appointments.no_past')}</Text>
            )
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appt, index) => (
              <View key={index} className="mb-6">
                <AppointmentCard
                  day={new Date(appt.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  time={`${appt.horaInicio} - ${appt.horaFin}`}
                  doctor={appt.doctorNombre ? appt.doctorNombre : appt.doctorId ? `Dr. ${appt.doctorId}` : ''}
                  specialty={appt.especialidad || appt.specialty || ''}
                  status="cancelled"
                  colorScheme={colorScheme}
                />
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-600">{t('appointments.no_cancelled')}</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal para filtrar por rango de fechas */}
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
              <View style={{
 backgroundColor: colorScheme === 'light' ? '#fff' : '#374151', // gray-700
 borderRadius: 16,
 padding: 20,
              }}>
 <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20, color: colorScheme === 'light' ? '#1F2937' : '#E5E7EB' }}>
                  {t('appointments.filter_dates.filter_title')}
                </Text>

                <View style={{ marginBottom: 20 }}>
 <Text style={{ color: colorScheme === 'light' ? '#1F2937' : '#E5E7EB', fontWeight: 'bold', marginBottom: 10 }}>
                    {t('appointments.filter_dates.filter_range')}
                  </Text>

                  <AppointmentsCalendar
                    onSelectDate={handleSelectDate}
                  />

                  <View
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
                  >
                    <Text style={{ color: '#2563EB' }}>
 {startDate ? `${t('appointments.filter_dates.start')}: ${startDate.toLocaleDateString('es')}` : `${t('appointments.filter_dates.start')}: -`}
                    </Text>
                    <Text style={{ color: '#2563EB' }}>
 {endDate ? `${t('appointments.filter_dates.end')}: ${endDate.toLocaleDateString('es')}` : `${t('appointments.filter_dates.end')}: -`}
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
                  onPress={() => {
                    console.log('Aplicar filtro presionado', { startDate, endDate });
 setShowFilterModal(false);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('appointments.filter_dates.apply_filter')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 10, alignItems: 'center' }}
                  onPress={() => {
                    console.log('Limpiar filtro presionado');
                    setStartDate(null);
                    setEndDate(null);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>{t('appointments.filter_dates.clear_filter')}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Pressable>
      </Modal>
    </AppContainer>
  );
}

/*
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';

export default function AppointmentsScreen({ navigation }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(null);
  const [selectedStars, setSelectedStars] = useState(null);


{/!* Modal de filtros *!/}
<Modal
  visible={showFilterModal}
  animationType="slide"
  transparent
  onRequestClose={() => setShowFilterModal(false)}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Filtrar por especialidad</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ marginBottom: 10 }}>
        {['Clínica', 'Pediatría', 'Cardiología', 'Dermatología', 'Traumatología', 'Oftalmología', 'Ginecología', 'Neurología'].map((esp, idx) => (
          <TouchableOpacity
            key={esp}
            style={{
              padding: 10,
              backgroundColor: selectedEspecialidad === esp ? '#2563EB' : '#E5E7EB',
              borderRadius: 20,
              marginRight: 10,
            }}
            onPress={() => setSelectedEspecialidad(esp)}
          >
            <Text style={{ color: selectedEspecialidad === esp ? '#fff' : '#1F2937' }}>{esp}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ height: 2, backgroundColor: '#2563EB', marginBottom: 20 }} />

      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Filtrar por estrellas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: selectedStars === star ? '#2563EB' : '#E5E7EB',
              borderRadius: 20,
              marginRight: 10,
            }}
            onPress={() => setSelectedStars(star)}
          >
            <Text style={{ color: selectedStars === star ? '#fff' : '#1F2937', marginRight: 5 }}>{star}</Text>
            {/!* Puedes usar tu icono de estrella aquí *!/}
            <Text style={{ color: selectedStars === star ? '#FFD700' : '#A0AEC0' }}>★</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ height: 2, backgroundColor: '#2563EB', marginVertical: 20 }} />

      <TouchableOpacity
        style={{
          backgroundColor: '#2563EB',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => setShowFilterModal(false)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Aplicar filtros</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
</AppContainer>*/
