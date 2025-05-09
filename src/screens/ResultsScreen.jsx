import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../store/slices/resultsSlice';
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';

export default function ResultsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.results);

  useEffect(() => {
    dispatch(fetchResults());
  }, [dispatch]);

  return (
    <AppContainer navigation={navigation} screenTitle="Resultados">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Resultados Médicos</Text>
          <Text className="text-sm text-gray-600 mb-4">Tus estudios y análisis clínicos</Text>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-semibold text-gray-800">Estudios recientes</Text>
            <FilterButton onPress={() => alert('Filtrar resultados')} />
          </View>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : results.length > 0 ? (
            results.map((result, index) => (
              <View key={index} className="mb-4">
                <AppointmentCard
                  day={new Date(result.date).toLocaleDateString('es', { day: 'numeric' })}
                  time={new Date(result.date).toLocaleDateString('es', { month: 'short' })}
                  doctor={result.title}
                  specialty={result.specialty}
                  location={result.file}
                  icon="file-pdf"
                  iconColor={index % 2 === 0 ? '#2e7d32' : '#1565c0'}
                  bgColor={index % 2 === 0 ? 'bg-green-100' : 'bg-blue-100'}
                />
                <TouchableOpacity
                  className="border border-blue-600 rounded-lg p-2 flex-row justify-center"
                  onPress={() => alert(`Descargando ${result.file}`)}
                >
                  <Text className="text-blue-600 text-sm">Descargar</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-600">No hay resultados disponibles</Text>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}