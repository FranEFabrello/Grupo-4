import React, { useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from '../store/slices/professionalsSlice';
import AppContainer from '../components/AppContainer';
import DoctorCard from '../components/DoctorCard';
import FilterButton from '../components/FilterButton';
import TimeSlot from '../components/TimeSlot';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ProfessionalsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { professionals, status } = useSelector((state) => state.professionals);

  useEffect(() => {
    dispatch(fetchProfessionals());
  }, [dispatch]);

  return (
    <AppContainer navigation={navigation} screenTitle="Profesionales">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Profesionales</Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 relative">
              <Icon name="search" size={16} color="#6c757d" className="absolute left-3 top-3" />
              <TextInput
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2"
                placeholder="Buscar profesional..."
              />
            </View>
            <FilterButton onPress={() => alert('Filtrar profesionales')} />
          </View>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : professionals.length > 0 ? (
            professionals.map((prof, index) => (
              <View key={index} className="mb-4">
                <DoctorCard
                  name={prof.name}
                  specialty={prof.specialty}
                  onBook={() => navigation.navigate('BookAppointment', { professionalId: prof.id })}
                />
                <Text className="text-sm text-gray-600 mt-2">{prof.bio}</Text>
                <Text className="text-sm font-semibold text-blue-600 mt-2">Próximos turnos disponibles</Text>
                <View className="flex-row flex-wrap justify-between mt-2">
                  {prof.times.map((time, idx) => (
                    <TimeSlot
                      key={idx}
                      time={time}
                      isSelected={false}
                      onSelect={() =>
                        navigation.navigate('BookAppointment', { professionalId: prof.id, time })
                      }
                    />
                  ))}
                </View>
                <TouchableOpacity
                  className="bg-blue-600 rounded-lg p-3 mt-3 flex-row justify-center"
                  onPress={() => navigation.navigate('BookAppointment', { professionalId: prof.id })}
                >
                  <Text className="text-white text-sm">Reservar turno</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-600">No hay profesionales disponibles</Text>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}