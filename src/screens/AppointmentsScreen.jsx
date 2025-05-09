import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../store/slices/appointmentsSlice';
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import TabButton from '../components/TabButton';

export default function AppointmentsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { appointments, status } = useSelector((state) => state.appointments);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const upcomingAppointments = appointments.filter((appt) => appt.status === 'upcoming' || (new Date(appt.date) >= new Date() && !appt.status));
  const pastAppointments = appointments.filter((appt) => appt.status === 'past' || (new Date(appt.date) < new Date() && !appt.status));
  const cancelledAppointments = appointments.filter((appt) => appt.status === 'cancelled');

  return (
    <AppContainer navigation={navigation} screenTitle="Mis Turnos">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">Mis Turnos</Text>
            <FilterButton onPress={() => alert('Filtrar turnos')} />
          </View>
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
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt, index) => (
                <AppointmentCard
                  key={index}
                  day={new Date(appt.date).toLocaleDateString('es', { weekday: 'short' })}
                  time={appt.time}
                  doctor={appt.doctor}
                  specialty={appt.specialty}
                  location={appt.location}
                  onCancel={() => alert('Turno cancelado')}
                />
              ))
            ) : (
              <Text className="text-sm text-gray-600">No hay turnos próximos</Text>
            )
          ) : activeTab === 'past' ? (
            pastAppointments.length > 0 ? (
              pastAppointments.map((appt, index) => (
                <View key={index} className="mb-6">
                  <AppointmentCard
                    day={new Date(appt.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                    time={appt.time}
                    doctor={appt.doctor}
                    specialty={appt.specialty}
                    location={appt.location}
                  />
                  <TouchableOpacity
                    className="border border-blue-600 rounded-lg p-2 flex-row justify-center"
                    onPress={() => navigation.navigate('MedicalNotes', { appointmentId: appt.id })}
                  >
                    <Text className="text-blue-600 text-sm">Ver notas médicas</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-sm text-gray-600">No hay turnos pasados</Text>
            )
          ) : cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appt, index) => (
              <View key={index} className="mb-6">
                <AppointmentCard
                  day={new Date(appt.date).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  time={appt.time}
                  doctor={appt.doctor}
                  specialty={appt.specialty}
                  location={appt.location}
                  status="cancelled"
                />
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-600">No hay turnos cancelados</Text>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}