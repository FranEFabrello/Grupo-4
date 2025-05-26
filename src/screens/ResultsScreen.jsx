import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from "~/store/slices/resultsSlice";
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import DateRangeFilterModal from '../components/DateRangeFilterModal';

export default function ResultsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.results);

  // Estado para el filtro de fechas
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  // Lógica para seleccionar fechas
  const handleSelectDate = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    }
  };

  // Filtrar resultados por rango de fechas
  const filteredResults = React.useMemo(() => {
    if (!startDate || !endDate) return results;
    return results.filter((result) => {
      const resultDate = new Date(result.date);
      return resultDate >= startDate && resultDate <= endDate;
    });
  }, [results, startDate, endDate]);

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
              <FilterButton onPress={() => setShowFilterModal(true)} />
            </View>
            {status === 'loading' ? (
              <Text className="text-sm text-gray-600">Cargando...</Text>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <View key={index} className="mb-4">
                  <AppointmentCard
                    day={new Date(result.date).toLocaleDateString('es', { day: 'numeric' })}
                    time={new Date(result.date).toLocaleDateString('es', { month: 'short' })}
                    doctor={result.title}
                    specialty={result.specialty}
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
        {/* Modal para filtrar por rango de fechas */}
        <DateRangeFilterModal
          visible={showFilterModal}
          startDate={startDate}
          endDate={endDate}
          onSelectDate={handleSelectDate}
          onApply={() => setShowFilterModal(false)}
          onClear={() => {
            setStartDate(null);
            setEndDate(null);
            setShowFilterModal(false);
          }}
          onClose={() => setShowFilterModal(false)}
        />
      </AppContainer>
    );
}