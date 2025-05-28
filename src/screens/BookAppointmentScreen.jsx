// BookAppointmentScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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

  const professionals = useSelector((state) => state.professionals.professionals);
  const { availableDays, availableTimeSlots, status } = useSelector((state) => state.appointments);
  const usuario = useSelector((state) => state.user.usuario);
  const specialties = useSelector((state) => state.medicalSpecialities.specialities);


  const [specialty, setSpecialty] = useState('');
  const [professional, setProfessional] = useState(professionalId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);

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
      const payload = {
        doctorId: professional,
        usuarioId: usuario?.id, // este dato ahora viene del userSlice
        fecha: selectedDate,
        horaInicio: selectedTime.horaInicio.substring(0, 5),
        horaFin: selectedTime.horaFin.substring(0, 5),
        nota: 'Consulta general',
        archivoAdjunto: null,
        estado: 'PENDIENTE',
      };

      console.log('Payload que se envía al backend:', payload); // ✅ Acá sí lo ves bien

      dispatch(bookAppointment(payload))
        .unwrap()
        .then(() => {
          alert('Turno confirmado exitosamente');
          navigation.navigate('Appointments');
        })
        .catch((err) => {
          console.error('Error del backend:', err);
          alert('Error al confirmar el turno');
        });
    } else {
      alert('Por favor, completa todos los campos');
    }
  };



  return (
    <AppContainer navigation={navigation} screenTitle="Reservar Turno">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Reservar Turno</Text>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : (
            <>
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
                  <Text className="text-base font-semibold text-gray-800 mt-4">Seleccionar fecha</Text>
                  <Calendar
                    availableDays={availableDays}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  />

                  <Text className="text-base font-semibold text-gray-800 mt-4">Horarios disponibles</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot, index) => (
                        <TimeSlot
                          key={index}
                          time={formatTimeSlot(slot)}
                          isSelected={selectedTime?.horaInicio === slot.horaInicio}
                          onSelect={() => setSelectedTime(slot)}
                        />
                      ))
                    ) : (
                      <Text className="text-sm text-gray-600">No hay horarios disponibles</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    className={`rounded-lg p-3 mt-4 flex-row justify-center ${
                      selectedTime ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onPress={handleConfirm}
                    disabled={!selectedTime}
                  >
                    <Text className="text-white text-base">
                      {selectedTime ? (
                        <>
                          {`Confirmar turno a las ${formatTimeSlot(selectedTime)}`}
                        </>
                      ) : 'Confirmar turno'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}
