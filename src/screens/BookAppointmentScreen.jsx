import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals, bookAppointment } from '../store/slices/appointmentsSlice';
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import Calendar from '../components/Calendar';
import TimeSlot from '../components/TimeSlot';

export default function BookAppointmentScreen({ navigation, route }) {
  const { professionalId, time } = route.params || {};
  const dispatch = useDispatch();
  const { professionals, status } = useSelector((state) => state.professionals);
  const [specialty, setSpecialty] = useState('');
  const [professional, setProfessional] = useState(professionalId || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(time || '');

  useEffect(() => {
    dispatch(fetchProfessionals());
  }, [dispatch]);

  const specialties = Array.from(new Set(professionals.map((p) => p.specialty))).map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
  }));

  const handleConfirm = () => {
    if (specialty && professional && selectedDate && selectedTime) {
      dispatch(
        bookAppointment({
          specialty,
          professional,
          date: selectedDate,
          time: selectedTime,
        })
      );
      alert('Turno confirmado exitosamente');
      navigation.navigate('Appointments');
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
                onChange={setSpecialty}
                items={specialties}
              />
              {specialty && (
                <ProfileField
                  label="Profesional"
                  type="picker"
                  value={professional}
                  onChange={setProfessional}
                  items={professionals
                    .filter((p) => p.specialty === specialty)
                    .map((p) => ({ value: p.id, label: p.name }))}
                />
              )}
              {professional && (
                <>
                  <Text className="text-base font-semibold text-gray-800 mt-4">Seleccionar fecha</Text>
                  <Calendar onSelectDate={setSelectedDate} />
                  <Text className="text-base font-semibold text-gray-800 mt-4">Horarios disponibles</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {professionals
                      .find((p) => p.id === professional)
                      ?.times.map((t) => (
                        <TimeSlot
                          key={t}
                          time={t}
                          isSelected={selectedTime === t}
                          onSelect={() => setSelectedTime(t)}
                        />
                      ))}
                  </View>
                  <TouchableOpacity
                    className={`rounded-lg p-3 mt-4 flex-row justify-center ${
                      selectedTime ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onPress={handleConfirm}
                    disabled={!selectedTime}
                  >
                    <Text className="text-white text-base">
                      {selectedTime ? `Confirmar turno a las ${selectedTime}` : 'Confirmar turno'}
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