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

  const userId = useSelector((state) => state.user.usuario.id);

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





  return (
      <AppContainer navigation={navigation} screenTitle="Resultados">
        <ScrollView className="p-5">
          <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-lg font-semibold text-gray-800">Resultados Médicos</Text>
                <Text className="text-sm text-gray-600">Estudios recientes</Text>
              </View>
              <FilterButton onPress={() => setShowFilterModal(true)} />
            </View>
            {status === 'loading' ? (
              <Text className="text-sm text-gray-600">Cargando...</Text>

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