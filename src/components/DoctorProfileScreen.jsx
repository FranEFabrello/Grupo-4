import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import { useTranslation } from 'react-i18next';


export default function DoctorProfileScreen({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { doctorId } = route.params;
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const especialidades = useSelector((state) => state.medicalSpecialities.specialities);
  const doctor = professionals.find((prof) => prof.id === doctorId);

  useEffect(() => {
    if (!professionals || professionals.length === 0) {
      dispatch(fetchProfessionals());
    }
    if (!especialidades || especialidades.length === 0) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch, professionals, especialidades]);

  if (professionalsStatus === 'loading' || !doctor) {
    return (
      <AppContainer navigation={navigation} screenTitle={t('doctor_profile.title')}>
        <View className="p-5">
          <Text className="text-sm text-gray-600">{t('global.loading')}</Text>
        </View>
      </AppContainer>
    );
  }

  const specialty = especialidades.find((esp) => esp.id === doctor.idEspecialidad)?.descripcion || t('doctor_profile.no_specialty');

  return (
    <AppContainer navigation={navigation} screenTitle={t('doctor_profile.title')}>
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 shadow-md">
          <View className="flex-row items-center mb-4">
            <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mr-4">
              <Icon name="user-md" size={36} color="#4a6fa5" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-800">{`${doctor.nombre} ${doctor.apellido}`}</Text>
              <Text className="text-sm text-gray-600">{specialty}</Text>
              <View className="flex-row items-center mt-1">
                {doctor.calificacionPromedio > 0 ? (
                  <>
                    <Text className="text-sm text-yellow-500 mr-1">{doctor.calificacionPromedio}</Text>
                    <Text className="text-sm text-yellow-500">★</Text>
                  </>
                ) : (
                  <Text className="text-sm text-gray-400">{t('doctor_profile.no_rating')}</Text>
                )}
              </View>
            </View>
          </View>
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">{t('doctor_card.additional_info')}</Text>
            <Text className="text-sm text-gray-600">{doctor.informacionAdicional || t('doctor_profile.no_additional_info')}</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 px-4 mt-4 flex-row justify-center items-center shadow-md"
            onPress={() => navigation.navigate('BookAppointment', { professionalId: doctorId })}
          >
            <Icon name="calendar-alt" size={18} color="#ffffff" className="mr-2" />
            <Text className="text-white text-sm font-semibold">{t('doctor_profile.book_button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppContainer>
  );
}

