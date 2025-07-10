import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from "~/store/slices/resultsSlice";
import AppContainer from '../components/AppContainer';
import AppointmentCard from '../components/AppointmentCard';
import FilterButton from '../components/FilterButton';
import DateRangeFilterModal from '../components/DateRangeFilterModal';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';
import { showToast } from "~/components/ToastProvider";
import { Platform, Linking } from 'react-native';

export default function ResultsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { results, status } = useSelector((state) => state.results);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();

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

  const usuario = useSelector((state) => state.user.usuario);
  const userId = usuario?.id;

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
    if (userId) {
      dispatch(fetchResults(userId));
    } else {
      //console.log('No user ID available, skipping fetchResults');
    }
  }, [dispatch, userId]);

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
          {(!userId) ? (
            <Text className={`text-sm ${secondaryText}`}>{t('results.no_user')}</Text>
          ) : status === 'loading' ? (
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
                {result.linkEstudio ? (
                  <TouchableOpacity
                    className={`${selectedButtonBg} rounded-lg py-2 flex-row justify-center items-center mt-2`}
                    onPress={async () => {
                      try {
                        const url = result.linkEstudio;
                        if (!url) {
                          throw new Error(t('results.empty') || 'No hay enlace disponible.');
                        }

                        if (Platform.OS === 'web' || Platform.OS === 'ios' || Platform.OS === 'android') {
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', '');
                          link.setAttribute('target', '_blank');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          const supported = await Linking.canOpenURL(url);
                          if (!supported) {
                            throw new Error('No se puede abrir este enlace en el dispositivo.');
                          }
                          await Linking.openURL(url);
                        }

                        showToast(
                          'success',
                          t('results.download.success_title') || 'Descarga iniciada',
                          t('results.download.success_message') || 'El archivo se abrió correctamente.'
                        );
                      } catch (error) {
                        console.error(error);
                        showToast(
                          'error',
                          t('results.download.error_title') || 'Error al abrir archivo',
                          error.message || t('results.download.error_message') || 'No se pudo abrir el archivo.'
                        );
                      }
                    }}
                  >
                    <Text className={`${selectedButtonText} text-sm font-semibold`}>
                      {t('results.download.button') || 'Descargar'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text className={`text-sm italic ${secondaryText}`}>
                    {t('results.empty') || 'No se adjuntó ningún archivo.'}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text className={`text-sm ${secondaryText}`}>{t('results.empty')}</Text>
          )}
        </View>
      </ScrollView>
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