import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal, Animated, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '~/providers/ThemeProvider';
import { fetchProfessionals } from "~/store/slices/professionalsSlice";
import {
  fetchAvailableDays,
  fetchAvailableTimeSlots,
  bookAppointment,
  clearAvailableTimeSlots,
} from "~/store/slices/appointmentsSlice";
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import Calendar from '../components/Calendar';
import TimeSlot from '../components/TimeSlot';
import { fetchSpecialities } from "~/store/slices/medicalSpecialitiesSlice";
import { useTranslation } from "react-i18next";
import LoadingOverlay from '../components/LoadingOverlay';
import { incrementUnreadCount } from "~/store/slices/notificationSlice";
import {
  rescheduleAppointment
} from "~/store/slices/appointmentsSlice";

export default function BookAppointmentScreen({ navigation, route }) {
  const { reprogramming, appointmentId, currentDate, currentStart, currentEnd, specialtyId } = route.params || {};
  const { professionalId } = route.params || {};
  const dispatch = useDispatch();
  const { colorScheme } = useAppTheme();
  const { t, i18n } = useTranslation();

  const professionals = useSelector((state) => state.professionals.professionals || []);
  const { availableDays = [], availableTimeSlots = [], status = 'idle' } = useSelector((state) => state.appointments || {});
  const usuario = useSelector((state) => state.user.usuario);
  const specialties = useSelector((state) => state.medicalSpecialities.specialities || []);

  const [specialty, setSpecialty] = useState('');
  const [professional, setProfessional] = useState(professionalId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    dispatch(fetchProfessionals());
    dispatch(fetchSpecialities());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [dispatch, fadeAnim]);

  useEffect(() => {
    if (professionalId && professionals?.length > 0) {
      const selectedProf = professionals.find((p) => p.id === professionalId);
      if (selectedProf) {
        setProfessional(professionalId);
        setSpecialty(selectedProf.idEspecialidad);
      }
    }
  }, [professionalId, professionals]);

  useEffect(() => {
    if (professional) {
      dispatch(fetchAvailableDays(professional));
      dispatch(clearAvailableTimeSlots());
      setSelectedDate('');
      setSelectedTime(null);
      setCalendarModalVisible(true);
    } else {
      setCalendarModalVisible(false);
    }
  }, [professional, dispatch]);

  useEffect(() => {
    if (selectedDate && professional) {
      dispatch(fetchAvailableTimeSlots({ professionalId: professional, date: selectedDate }));
    }
  }, [selectedDate, professional, dispatch]);

  const handleSpecialtyChange = (value) => {
    setSpecialty(value);
    setProfessional('');
    setSelectedDate('');
    setSelectedTime(null);
  };

  const handleProfessionalChange = (value) => {
    setProfessional(value);
    setSelectedDate('');
    setSelectedTime(null);
  };

  const formatTimeSlot = (slot) => {
    const start = slot.horaInicio.slice(0, 5);
    const end = slot.horaFin.slice(0, 5);
    return `${start}-${end}`;
  };

  const isTimeSlotPast = (slot, selectedDate) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    console.log('isTimeSlotPast - Current Date:', currentDate, 'Selected Date:', selectedDate);
    console.log('Slot Time:', slot.horaInicio);

    // Si selectedDate está vacío o no es la fecha actual, no filtramos
    if (!selectedDate || selectedDate !== currentDate) {
      console.log('Selected date is not today or is empty, allowing slot');
      return false;
    }

    // Validar formato de horaInicio
    let [hours, minutes, seconds = 0] = slot.horaInicio.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return true; // Filtra el slot si el formato es inválido
    }
    // Crear slotTime con la fecha actual, ajustando para la zona horaria local
    const [year, month, day] = currentDate.split('-').map(Number);
    const slotTime = new Date(year, month - 1, day, hours, minutes, seconds); // Meses en JS son 0-based
    // Margen de 5 minutos desde la hora actual
    const bufferMinutes = 5;
    const bufferTime = new Date(now.getTime() + bufferMinutes * 60 * 1000);
    return slotTime <= bufferTime;
  };

  const handleConfirm = () => {
    console.log('handleConfirm called', { specialty, professional, selectedDate, selectedTime, reprogramming, appointmentId });
    if (specialty && professional && selectedDate && selectedTime) {
      setLoading(true);

      if (reprogramming && appointmentId) {
        dispatch(
          rescheduleAppointment({
            turnoId: appointmentId,
            nuevaFecha: selectedDate,
            nuevaHoraInicio: selectedTime.horaInicio.substring(0, 5),
            nuevaHoraFin: selectedTime.horaFin.substring(0, 5),
          })
        )
          .unwrap()
          .then(() => {
            setModalMessage(t('appointments.reschedule_confirmation'));
            setModalSuccess(true);
            setModalVisible(true);
            setTimeout(() => {
              setModalVisible(false);
              navigation.navigate('Appointments');
            }, 2000);
          })
          .catch((err) => {
            console.log('Error en rescheduleAppointment:', err);
            setModalMessage(t('book_appointment.alerts.error'));
            setModalSuccess(false);
            setModalVisible(true);
          })
          .finally(() => setLoading(false));
        dispatch(incrementUnreadCount());
      } else {
        let payload = {
          doctorId: professional,
          usuarioId: usuario?.id,
          fecha: selectedDate,
          horaInicio: selectedTime.horaInicio.substring(0, 5),
          horaFin: selectedTime.horaFin.substring(0, 5),
          nota: 'Consulta general',
          archivoAdjunto: null,
          estado: 'PENDIENTE',
        };

        console.log('Dispatching bookAppointment', payload);
        dispatch(bookAppointment(payload))
          .unwrap()
          .then(() => {
            setModalMessage(t('appointments.alerts.confirmation'));
            setModalSuccess(true);
            setModalVisible(true);
            setTimeout(() => {
              setModalVisible(false);
              navigation.navigate('Appointments');
            }, 2000);
          })
          .catch((err) => {
            console.log('Error en bookAppointment:', err);
            setModalMessage(t('book_appointment.alerts.error'));
            setModalSuccess(false);
            setModalVisible(true);
          })
          .finally(() => setLoading(false));
        dispatch(incrementUnreadCount());
      }
    } else {
      console.log('Campos faltantes en handleConfirm');
      setModalMessage(t('book_appointment.alerts.missing_fields'));
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  const cardClass = colorScheme === 'light' ? 'bg-white border border-gray-200 shadow-xl' : 'bg-gray-800 border border-gray-700 shadow-xl';
  const textClass = colorScheme === 'light' ? 'text-gray-900' : 'text-gray-100';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <AppContainer navigation={navigation} screenTitle={t('home.quick_actions.book')}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps="handled">
            <View className={`rounded-2xl p-8 w-full ${cardClass}`}>
              <Text className={`text-xl font-bold mb-6 ${textClass}`}>{t('home.quick_actions.book')}</Text>
              <ProfileField
                label={t('book_appointment.fields.specialty')}
                type="picker"
                value={specialty}
                onChange={handleSpecialtyChange}
                items={specialties.map(e => ({ value: e.id, label: e.descripcion }))}
                disabled={!!professionalId}
                colorScheme={colorScheme}
              />
              {specialty && (
                <ProfileField
                  label={t('book_appointment.fields.professional')}
                  type="picker"
                  value={professional}
                  onChange={handleProfessionalChange}
                  items={professionals
                    .filter((p) => p.idEspecialidad === parseInt(specialty, 10))
                    .map((p) => ({ value: p.id, label: `${p.nombre} ${p.apellido}` }))}
                  colorScheme={colorScheme}
                />
              )}
              {professional && (
                <View>
                  <Text className={`text-lg font-semibold mt-8 mb-3 ${textClass}`}>{t('book_appointment.select_date')}</Text>
                  <TouchableOpacity
                    className={`rounded-xl border ${colorScheme === 'light' ? 'border-blue-200 bg-blue-50' : 'border-blue-700 bg-blue-900'} px-4 py-3 mb-8 w-full items-center`}
                    onPress={() => setCalendarModalVisible(true)}
                  >
                    <Text
                      className={`text-base ${selectedDate ? (colorScheme === 'light' ? 'text-blue-900 font-semibold' : 'text-white font-semibold') : 'text-gray-400'} text-center`}
                    >
                      {selectedDate ? selectedDate : t('book_appointment.choose_date')}
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    visible={calendarModalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setCalendarModalVisible(false)}
                  >
                    <View className="flex-1 justify-center items-center bg-black/50">
                      <View className={`w-11/12 max-w-lg ${colorScheme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-6 shadow-2xl`}>
                        <Calendar
                          availableDays={availableDays}
                          onSelectDate={(date) => {
                            setSelectedDate(date);
                            setSelectedTime(null);
                            setCalendarModalVisible(false);
                          }}
                          selectedDate={selectedDate}
                          colorScheme={colorScheme}
                          isLoading={status === 'loading'}
                        />
                        <TouchableOpacity
                          className={`mt-4 px-6 py-3 rounded-xl ${colorScheme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} items-center`}
                          onPress={() => setCalendarModalVisible(false)}
                        >
                          <Text className={`text-base font-semibold ${colorScheme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{t('global.button.close')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <Text className={`text-lg font-semibold mt-8 mb-3 ${textClass}`}>{t('book_appointment.available_times')}</Text>
                  <View className="mb-8">
                    {status === 'loading' ? (
                      <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563eb' : '#60a5fa'} />
                    ) : availableTimeSlots.length > 0 ? (
                      availableTimeSlots
                        .filter((slot) => !isTimeSlotPast(slot, selectedDate))
                        .map((slot, index) => (
                          <TimeSlot
                            key={index}
                            time={formatTimeSlot(slot)}
                            isSelected={selectedTime?.horaInicio === slot.horaInicio}
                            onSelect={() => setSelectedTime(slot)}
                            colorScheme={colorScheme}
                          />
                        ))
                    ) : (
                      <Text className={`text-base ${secondaryTextClass}`}>{t('book_appointment.no_times')}</Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          {selectedTime && (
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 20, alignItems: 'center', zIndex: 10 }} pointerEvents="box-none">
              <TouchableOpacity
                className={`rounded-xl p-4 w-11/12 flex-row justify-center shadow-lg ${primaryButtonClass}`}
                onPress={handleConfirm}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-lg font-bold">
                    {t('book_appointment.confirm_button.with_time')} {formatTimeSlot(selectedTime)}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => {
              setModalVisible(false);
              if (modalSuccess) navigation.navigate('Appointments');
            }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className={`w-80 p-6 rounded-2xl ${cardClass} items-center shadow-2xl`}>
                <Text className={`text-lg font-semibold mb-4 ${modalSuccess ? 'text-green-500' : 'text-red-500'}`}>{modalMessage}</Text>
                <TouchableOpacity
                  className={`px-6 py-3 rounded-xl ${primaryButtonClass}`}
                  onPress={() => {
                    setModalVisible(false);
                    if (modalSuccess) {
                      console.log('Navigating to Appointments (modal OK)');
                      navigation.navigate('Appointments');
                    }
                  }}
                >
                  <Text className="text-white text-base font-semibold">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {loading && <LoadingOverlay />}
        </View>
      </Animated.View>
    </AppContainer>
  );
}