import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialities } from "~/store/slices/medicalSpecialitiesSlice";
import AppContainer from "../components/AppContainer";
import DoctorCardForProf from "~/components/DoctorCardForProf";
import FilterButton from "../components/FilterButton";
import { useTranslation } from 'react-i18next';
import { fetchProfessionals } from "~/store/slices/professionalsSlice";
import { useAppTheme } from "~/providers/ThemeProvider";

export default function ProfessionalsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { professionals, status } = useSelector((state) => state.professionals);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);
  const { t } = useTranslation();
  const especialidades = useSelector((state) => state.medicalSpecialities.specialities);
  const { colorScheme } = useAppTheme();

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-600';
  const cardBg = colorScheme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-600';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const inputBg = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const modalBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const modalDivider = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-600';
  const buttonBg = colorScheme === 'light' ? 'bg-gray-300' : 'bg-gray-500';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-500' : 'bg-blue-700';
  const buttonText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const selectedButtonText = 'text-white';
  const starColor = colorScheme === 'light' ? 'text-yellow-500' : 'text-yellow-400';
  const starInactiveColor = colorScheme === 'light' ? 'text-gray-400' : 'text-gray-300';

  useEffect(() => {
    if (!professionals.length) {
      dispatch(fetchProfessionals());
    }
    if (!especialidades.length) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch, professionals.length, especialidades.length]);

  const [especialidadSearchQuery, setEspecialidadSearchQuery] = useState("");

  const filteredProfessionals = professionals
    .filter((prof) =>
      `${prof.nombre} ${prof.apellido} ${prof.especialidadInfo?.descripcion}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    .filter((prof) => {
      if (selectedEspecialidades.length > 0) {
        return selectedEspecialidades.some(e => e.id === prof.idEspecialidad);
      }
      return true;
    })
    .filter((prof) =>
      selectedStars
        ? Math.round(prof.calificacion || 0) === selectedStars
        : true,
    );

  return (
    <AppContainer navigation={navigation} screenTitle={t('professionals.title')}>
      <ScrollView className="p-5">
        <View className={`${containerBg} rounded-lg p-4 mb-4 shadow-md`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-4`}>
            {t('professionals.title')}
          </Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 relative">
              <Icon
                name="search"
                size={16}
                color={colorScheme === 'light' ? '#6c757d' : '#9CA3AF'}
                className="absolute left-3 top-3"
              />
              <TextInput
                className={`${inputBg} rounded-full pl-10 pr-4 py-2 ${primaryText}`}
                placeholder={t('professionals.search')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colorScheme === 'light' ? '#6B7280' : '#9CA3AF'}
              />
            </View>
            <FilterButton
              onPress={() => setShowFilterModal(true)}
              className={`${selectedButtonBg} rounded-full px-4 py-2.5 ml-2 flex-row items-center`}
              textClassName={`${selectedButtonText} font-semibold text-sm`}
              iconColor="#FFFFFF"
            />
          </View>
          {/* Filtros seleccionados */}
          {(selectedEspecialidades.length > 0 || selectedStars) && (
            <View className="flex-row flex-wrap mb-2.5">
              {selectedEspecialidades.map((esp) => (
                <View key={esp.id} className={`${selectedButtonBg} rounded-xl px-2.5 py-1 mr-1.5 mb-1.5`}>
                  <Text className={`${selectedButtonText} text-xs`}>{esp.descripcion}</Text>
                </View>
              ))}
              {selectedStars && (
                <View className={`${selectedButtonBg} rounded-xl px-2.5 py-1 mr-1.5 mb-1.5 flex-row items-center`}>
                  <Text className={`${selectedButtonText} text-xs mr-1`}>{selectedStars}</Text>
                  <Text className={`${starColor} text-xs`}>★</Text>
                </View>
              )}
            </View>
          )}
          {status === "loading" ? (
            <Text className={`text-sm ${secondaryText}`}>{t('global.alert.loading')}</Text>
          ) : filteredProfessionals.length > 0 ? (
            <View className="flex-col gap-y-2">
              {filteredProfessionals.map((prof) => (
                <DoctorCardForProf
                  key={prof.id}
                  name={`${prof.nombre} ${prof.apellido}`}
                  specialty={
                    especialidades.find(
                      (esp) => esp.id === prof.idEspecialidad
                    )?.descripcion || t('professionals.alerts.no_specialty')
                  }
                  stars={prof.calificacionPromedio > 0 ? prof.calificacionPromedio : null}
                  noRating={prof.calificacionPromedio === 0}
                  imageUrl={prof.urlImagenDoctor}
                  onBook={() =>
                    navigation.navigate("BookAppointment", {
                      professionalId: prof.id,
                    })
                  }
                  containerClassName="w-full"
                  colorScheme={colorScheme}
                  cardHeight={140} // Reducido para un diseño más compacto
                />
              ))}
            </View>
          ) : (
            <Text className={`text-sm ${secondaryText}`}>
              {t('professionals.alerts.empty')}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de filtros */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/20 justify-center items-center">
          <View className={`${modalBg} rounded-xl p-5 w-[90%]`}>
            <Text className={`font-bold text-lg mb-2.5 ${primaryText}`}>
              {t('professionals.filter_especiality')}
            </Text>
            <View className="flex-row items-center mb-2.5">
              <Icon
                name="search"
                size={16}
                color={colorScheme === 'light' ? '#6c757d' : '#9CA3AF'}
                className="mr-2"
              />
              <TextInput
                className={`${inputBg} rounded-xl px-3 py-1.5 flex-1 ${primaryText}`}
                placeholder={t('professionals.specialty_search')}
                value={especialidadSearchQuery}
                onChangeText={setEspecialidadSearchQuery}
                placeholderTextColor={colorScheme === 'light' ? '#6B7280' : '#9CA3AF'}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2.5">
              {especialidades
                .filter((esp) =>
                  esp.descripcion
                    .toLowerCase()
                    .includes((especialidadSearchQuery || '').toLowerCase())
                )
                .map((esp) => (
                  <TouchableOpacity
                    key={esp.id}
                    className={`px-2.5 py-1.5 ${selectedEspecialidades.some(e => e.id === esp.id) ? selectedButtonBg : buttonBg} rounded-xl mr-2.5`}
                    onPress={() => {
                      setSelectedEspecialidades((prev) =>
                        prev.some(e => e.id === esp.id)
                          ? prev.filter((e) => e.id !== esp.id)
                          : [...prev, { id: esp.id, descripcion: esp.descripcion }]
                      );
                    }}
                  >
                    <Text className={`${selectedEspecialidades.some(e => e.id === esp.id) ? selectedButtonText : buttonText}`}>
                      {esp.descripcion}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View className={`${modalDivider} h-0.5 mb-5`} />

            <Text className={`font-bold text-lg mb-2.5 ${primaryText}`}>
              {t('professionals.filter_star')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  className={`flex-row items-center px-2.5 py-1.5 ${selectedStars === star ? selectedButtonBg : buttonBg} rounded-xl mr-2.5`}
                  onPress={() => setSelectedStars(selectedStars === star ? null : star)}
                >
                  <Text className={`${selectedStars === star ? selectedButtonText : buttonText} mr-1`}>{star}</Text>
                  <Text className={`${selectedStars === star ? starColor : starInactiveColor}`}>★</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className={`${modalDivider} h-0.5 my-5`} />

            <TouchableOpacity
              className={`${selectedButtonBg} py-3 rounded-lg items-center`}
              onPress={() => setShowFilterModal(false)}
            >
              <Text className={`${selectedButtonText} font-bold`}>{t('professionals.aplly_filter')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-2.5 items-center"
              onPress={() => {
                setSelectedEspecialidades([]);
                setSelectedStars(null);
                setShowFilterModal(false);
              }}
            >
              <Text className={`${selectedButtonText} font-bold`}>{t('professionals.clear_filter')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AppContainer>
  );
}