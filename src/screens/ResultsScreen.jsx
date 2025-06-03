import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from "~/store/slices/resultsSlice";
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import DateRangeFilterModal from '../components/DateRangeFilterModal';
import { useTranslation } from 'react-i18next';

export default function ResultsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.results);
  const { t } = useTranslation();

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

  // Filtrar resultados por rango de fechas usando el campo 'fechaEstudio' del backend
  const filteredResults = React.useMemo(() => {
    if (!startDate && !endDate) return results;
    return results.filter((result) => {
      if (!result.fechaEstudio) return false;
      const resultDate = new Date(result.fechaEstudio);
      if (startDate && !endDate) {
        // Si solo hay fecha de inicio, mostrar solo los posteriores (inclusive)
        return resultDate >= startDate;
      }
      if (!startDate && endDate) {
        // Si solo hay fecha de fin, mostrar solo los anteriores (inclusive)
        return resultDate <= endDate;
      }
      // Si hay ambas fechas, filtrar por rango
      return resultDate >= startDate && resultDate <= endDate;
    }).sort((a, b) => {
      if (!a.fechaEstudio) return 1;
      if (!b.fechaEstudio) return -1;
      return new Date(b.fechaEstudio) - new Date(a.fechaEstudio);
    });
  }, [results, startDate, endDate]);

  useEffect(() => {
    console.log('Fetching results for user ID:', userId);
    dispatch(fetchResults(userId));
    console.log('Fetching results for user ID2:', userId);
  }, [dispatch]);

  return (
    <AppContainer navigation={navigation} screenTitle={t('results.screen_title')}>
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-semibold text-gray-800">{t('results.title')}</Text>
              <Text className="text-sm text-gray-600">{t('results.section_title')}</Text>
            </View>
            <FilterButton onPress={() => setShowFilterModal(true)} />
          </View>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">{t('global.alert.loading')}</Text>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <View
                key={result.id.toString()}
                className="bg-blue-50 rounded-lg p-4 mb-2"
              >
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  {result.tipo?.toUpperCase() === 'ESTUDIO' ? t('results.tests') : t('results.prescription')}
                </Text>
                <Text className="text-sm text-gray-700 mb-1">
                  {t('results.info.patient')} {result.usuario?.nombre} {result.usuario?.apellido}
                </Text>
                <Text className="text-sm text-gray-700 mb-1">
                  {t('results.info.date')} {result.fechaEstudio ? new Date(result.fechaEstudio).toLocaleDateString('es-AR') : '-'}
                </Text>
                <Text className="text-sm text-gray-700 mb-1">
                  {t('results.info.test_name')} {result.nombreEstudio || '-'}
                </Text>
                <Text className="text-sm text-gray-700 mb-1">
                  Link: {result.linkEstudio}
                </Text>
                <TouchableOpacity
                  className="border border-blue-600 rounded-lg p-2 flex-row justify-center mt-2"
                  onPress={() => alert(t('medical_note.alert.download_alert') + '${result.linkEstudio}')}
                >
                  <Text className="text-blue-600 text-sm">{t('results.download.button')}</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-600">{t('results.download.empty')}</Text>
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