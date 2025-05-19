import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfessionals } from '../store/slices/professionalsSlice';
import AppContainer from '../components/AppContainer';
import DoctorCard from '../components/DoctorCard';
import FilterButton from '../components/FilterButton';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ProfessionalsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { professionals, status } = useSelector((state) => state.professionals);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProfessionals());
  }, [dispatch]);

  const filteredProfessionals = professionals.filter((prof) =>
    `${prof.nombre} ${prof.apellido} ${prof.informacionAdicional}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <FilterButton onPress={() => alert('Filtrar profesionales')} />
          </View>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : filteredProfessionals.length > 0 ? (
            filteredProfessionals.map((prof, index) => (
              <View key={index} className="mb-4">
                <DoctorCard
                  name={`${prof.nombre} ${prof.apellido}`}
                  specialty={prof.informacionAdicional}
                  onBook={() => navigation.navigate('BookAppointment', { professionalId: prof.id })}
                />
                <Text className="text-sm text-gray-600 mt-2">{prof.informacionAdicional}</Text>
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