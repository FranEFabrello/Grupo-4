import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from "~/store/slices/resultsSlice";
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import DateRangeFilterModal from '../components/DateRangeFilterModal';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

export default function ResultsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.results);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const cardBg = colorScheme === 'light' ? 'bg-blue-50' : 'bg-gray-800';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const selectedButtonText = 'text-white';

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
        return resultDate >= startDate;
      }
      if (!startDate && endDate) {
        return resultDate <= endDate;
      }
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
        <View className={`${containerBg} rounded-lg p-4 mb-4 shadow-md`}>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className={`text-lg font-semibold ${primaryText}`}>{t('results.title')}</Text>
              <Text className={`text-sm ${secondaryText}`}>{t('results.section_title')}</Text>
            </View>
            <FilterButton
              onPress={() => setShowFilterModal(true)}
              className={`${selectedButtonBg} rounded-xl px-4 py-2.5 ml-2 flex-row items-center`}
              textClassName={`${selectedButtonText} font-semibold text-sm`}
              iconColor="#FFFFFF"
            />
          </View>
          {status === 'loading' ? (
            <Text className={`text-sm ${secondaryText}`}>{t('global.alert.loading')}</Text>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <View
                key={result.id.toString()}
                className={`${cardBg} rounded-lg p-4 mb-2`}
              >
                <Text className={`text-base font-semibold ${primaryText} mb-1`}>
                  {result.tipo?.toUpperCase() === 'ESTUDIO' ? t('results.tests') : t('results.prescription')}
                </Text>
                <Text className={`text-sm ${secondaryText} mb-1`}>
                  {t('results.info.patient')} {result.usuario?.nombre} {result.usuario?.apellido}
                </Text>
                <Text className={`text-sm ${secondaryText} mb-1`}>
                  {t('results.info.date')} {result.fechaEstudio ? new Date(result.fechaEstudio).toLocaleDateString('es-AR') : '-'}
                </Text>
                <Text className={`text-sm ${secondaryText} mb-1`}>
                  {t('results.info.test_name')} {result.nombreEstudio || '-'}
                </Text>
                <Text className={`text-sm ${secondaryText} mb-1`}>
                  Link: {result.linkEstudio}
                </Text>
                <TouchableOpacity
                  className={`${selectedButtonBg} rounded-lg py-2 flex-row justify-center mt-2`}
                  onPress={() => alert(t('medical_note.alert.download_alert') + `${result.linkEstudio}`)}
                >
                  <Text className={`${selectedButtonText} text-sm font-semibold`}>{t('results.download.button')}</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className={`text-sm ${secondaryText}`}>{t('results.download.empty')}</Text>
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
        containerClassName={colorScheme === 'light' ? 'bg-white' : 'bg-gray-800'}
        textClassName={primaryText}
        buttonClassName={selectedButtonBg}
        buttonTextClassName={selectedButtonText}
      />
    </AppContainer>
  );
}