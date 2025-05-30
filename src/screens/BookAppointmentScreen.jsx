import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
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

export default function BookAppointmentScreen({ navigation, route }) {
  const { professionalId } = route.params || {};
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const professionals = useSelector((state) => state.professionals.professionals);
  const { availableDays, availableTimeSlots, status } = useSelector((state) => state.appointments);
  const usuario = useSelector((state) => state.user.usuario);
  const specialties = useSelector((state) => state.medicalSpecialities.specialities);

  const [specialty, setSpecialty] = useState('');
  const [professional, setProfessional] = useState(professionalId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProfessionals());
    dispatch(fetchSpecialities());
  }, [dispatch]);

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
    }
  }, [professional, dispatch]);

  useEffect(() => {
    if (selectedDate && professional) {
      dispatch(fetchAvailableTimeSlots({ professionalId: professional, date: selectedDate }));
    }
  }, [selectedDate, professional, dispatch]);

  const formatTimeSlot = (slot) => {
    const start = slot.horaInicio.slice(0, 5);
    const end = slot.horaFin.slice(0, 5);
    return `${start}-${end}`;
  };

  const handleConfirm = () => {
    if (specialty && professional && selectedDate && selectedTime) {
      setLoading(true);
      const payload = {
        doctorId: professional,
        usuarioId: usuario?.id,
        fecha: selectedDate,
        horaInicio: selectedTime.horaInicio.substring(0, 5),
        horaFin: selectedTime.horaFin.substring(0, 5),
        nota: 'Consulta general',
        archivoAdjunto: null,
        estado: 'PENDIENTE',
      };
      dispatch(bookAppointment(payload))
        .unwrap()
        .then(() => {
          setModalMessage('¡Turno confirmado exitosamente!');
          setModalSuccess(true);
          setModalVisible(true);
        })
        .catch(() => {
          setModalMessage('Error al confirmar el turno');
          setModalSuccess(false);
          setModalVisible(true);
        })
        .finally(() => setLoading(false));
    } else {
      setModalMessage('Por favor, completa todos los campos');
      setModalSuccess(false);
      setModalVisible(true);
    }
  };

  // Clases para modo oscuro/claro
  const cardClass = colorScheme === 'light' ? 'bg-gray-600 border border-gray-200 shadow-lg' : 'bg-gray-700';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';

  return (
    <AppContainer navigation={navigation} screenTitle="Reservar Turno">
      <ScrollView className={`p-5`}>
        <View className={`rounded-lg p-4 mb-4 ${cardClass}`}>
          <Text className={`text-lg font-semibold mb-4 ${textClass}`}>Reservar Turno</Text>
          <ProfileField
            label="Especialidad"
            type="picker"
            value={specialty}
            onChange={(value) => {
              setSpecialty(value);
              setProfessional('');
            }}
            items={specialties.map(e => ({ value: e.id, label: e.descripcion }))}
            disabled={!!professionalId}
          />
          {specialty && (
            <ProfileField
              label="Profesional"
              type="picker"
              value={professional}
              onChange={setProfessional}
              items={professionals
                .filter((p) => p.idEspecialidad === parseInt(specialty, 10) )
                  .map((p) => ({ value: p.id, label: `${p.nombre} ${p.apellido}` }))}
            />
          )}
          {professional && (
            <>
              <Text className={`text-base font-semibold mt-4 ${textClass}`}>Seleccionar fecha</Text>
              <View className="relative">
                <Calendar
                  availableDays={availableDays}
                  onSelectDate={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  selectedDate={selectedDate}
                  colorScheme={colorScheme}
                />
                {status === 'loading' && (
                  <View className="absolute inset-0 bg-black/10 justify-center items-center z-10 rounded-xl">
                    <ActivityIndicator size="large" color="#2563eb" />
                  </View>
                )}
              </View>
              <Text className={`text-base font-semibold mt-4 ${textClass}`}>Horarios disponibles</Text>
              <View className="flex-row flex-wrap justify-between">
                {status === 'loading' ? (
                  <ActivityIndicator size="small" color="#2563eb" />
                ) : availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot, index) => (
                    <TimeSlot
                      key={index}
                      time={formatTimeSlot(slot)}
                      isSelected={selectedTime?.horaInicio === slot.horaInicio}
                      onSelect={() => setSelectedTime(slot)}
                    />
                  ))
                ) : (
                  <Text className={`text-sm ${secondaryTextClass}`}>No hay horarios disponibles</Text>
                )}
              </View>
              <TouchableOpacity
                className={`rounded-lg p-3 mt-4 flex-row justify-center ${selectedTime ? primaryButtonClass : 'bg-gray-300'}`}
                onPress={handleConfirm}
                disabled={!selectedTime || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base">
                    {selectedTime ? `Confirmar turno a las ${formatTimeSlot(selectedTime)}` : 'Confirmar turno'}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* Modal de confirmación y error */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            if (modalSuccess) navigation.navigate('Appointments');
          }}
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className={`w-80 p-6 rounded-lg ${cardClass} items-center`}>
              <Text className={`text-lg font-semibold mb-2 ${modalSuccess ? 'text-green-600' : 'text-red-600'}`}>{modalMessage}</Text>
              <TouchableOpacity
                className={`mt-4 px-6 py-2 rounded-lg ${primaryButtonClass}`}
                onPress={() => {
                  setModalVisible(false);
                  if (modalSuccess) navigation.navigate('Appointments');
                }}
              >
                <Text className="text-white font-semibold">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AppContainer>
  );
}
