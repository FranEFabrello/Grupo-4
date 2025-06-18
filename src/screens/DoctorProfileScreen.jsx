import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from "../providers/ThemeProvider";

export default function DoctorProfileScreen({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { doctorId, doctor } = route.params;
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const especialidades = useSelector((state) => state.medicalSpecialities.specialities);
  const { colorScheme } = useAppTheme();

  // Clases según modo oscuro/claro
  const bgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const textPrimary = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const textSecondary = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = colorScheme === 'light' ? 'border-red-600' : 'border-red-900';
  const nonWorkingBg = colorScheme === 'light' ? 'bg-red-100 border-red-300' : 'bg-red-900 border-red-700';
  const nonWorkingText = colorScheme === 'light' ? 'text-red-700 font-bold' : 'text-red-200 font-bold';
  // Cambia el color del label de días no laborables en modo oscuro
  const nonWorkingLabel = colorScheme === 'light' ? 'text-red-500' : 'text-white font-bold';

  // Si viene el objeto doctor por params, úsalo directamente, si no, búscalo por id
  const doctorData = doctor || professionals.find((prof) => prof.id === (doctorId || (doctor && doctor.id)));

  // Utilidades para mostrar días en español
  const daysMap = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  // Obtener días no laborables
  const nonWorkingDays = (doctorData.schedules || []).filter(sch => sch.nonWorkingDay && (sch.dayOfWeek || sch.specificDate));
  const workingDays = (doctorData.schedules || []).filter(sch => !sch.nonWorkingDay);

  useEffect(() => {
    if (!professionals || professionals.length === 0) {
      dispatch(fetchProfessionals());
    }
    if (!especialidades || especialidades.length === 0) {
      dispatch(fetchSpecialities());
    }
  }, [dispatch, professionals, especialidades]);

  if (professionalsStatus === 'loading' || !doctorData) {
    return (
      <AppContainer navigation={navigation} screenTitle={t('doctor_profile.title')}>
        <View className="p-5">
          <Text className="text-sm text-gray-600">{t('global.loading')}</Text>
        </View>
      </AppContainer>
    );
  }
  //Acá iría la traducción de la especialidad
  const specialty = especialidades.find((esp) => esp.id === doctorData.idEspecialidad)?.descripcion || t('doctor_profile.no_specialty');

  return (
    <AppContainer navigation={navigation} screenTitle={t('doctor_profile.title')}>
      <ScrollView className={`p-5 ${bgClass}`}>
        <View className={`${cardClass} rounded-lg p-4 shadow-md`}>
          <View className="flex-row items-center mb-4">
            {doctorData.urlImagenDoctor ? (
              <Image
                source={{ uri: doctorData.urlImagenDoctor }}
                className="w-24 h-24 rounded-full mr-4"
                resizeMode="cover"
              />
            ) : (
              <View className="w-24 h-24 bg-gray-200 rounded-full justify-center items-center mr-4">
                <Icon name="user-md" size={36} color="#4a6fa5" />
              </View>
            )}
            <View className="flex-1">
              <Text className={`text-xl font-semibold ${textPrimary}`}>{`${doctorData.nombre} ${doctorData.apellido}`}</Text>
              <Text className={`text-sm ${textSecondary}`}>{specialty}</Text>
              <View className="flex-row items-center mt-1">
                {doctorData.calificacionPromedio > 0 ? (
                  <>
                    <Text className="text-sm text-yellow-500 mr-1">{doctorData.calificacionPromedio}</Text>
                    <Text className="text-sm text-yellow-500">★</Text>
                  </>
                ) : (
                  <Text className={`text-sm ${textSecondary}`}>{t('doctor_profile.no_rating')}</Text>
                )}
              </View>
              <Text className={`text-xs ${textSecondary} mt-2`}>📞 {doctorData.telefono}</Text>
              <Text className={`text-xs ${textSecondary}`}>✉️ {doctorData.correo}</Text>
            </View>
          </View>
          <View className={`border-t pt-4 ${borderClass}`}>
            <Text className={`text-lg font-semibold ${textPrimary} mb-2`}>{t('doctor_profile.additional_info')}</Text>
            <Text className={`text-sm ${textSecondary} mb-4`}>{doctorData.informacionAdicional || t('doctor_profile.no_additional_info')}</Text>
            <Text className={`text-lg font-semibold ${textPrimary} mb-2`}>{t('doctor_profile.consultation')}</Text>
            {/* Días laborables */}
            {workingDays.length > 0 ? (
              workingDays.map((sch, idx) => (
                <View key={idx} className="mb-2 flex-row items-center">
                  {sch.dayOfWeek ? (
                    <Text className={`text-sm ${textPrimary} w-28`}>{daysMap[sch.dayOfWeek]}</Text>
                  ) : (
                    <Text className={`text-sm ${textPrimary} w-28`}>{sch.specificDate}</Text>
                  )}
                  <Text className={`text-sm ${textSecondary} ml-2`}>{sch.startTime && sch.endTime ? `${sch.startTime.slice(0,5)} - ${sch.endTime.slice(0,5)}` : '-'}</Text>
                </View>
              ))
            ) : (
              <Text className={`text-sm ${textSecondary}`}>{t('doctor_profile.no_times')}</Text>
            )}
            {/* Días no laborables */}
            {nonWorkingDays.length > 0 && (
              <View className="mb-2 mt-2">
                <Text className={`text-sm font-semibold mb-1 ${nonWorkingLabel}`}>{t('doctor_profile.non_working')}</Text>
                <View className="flex-row flex-wrap">
                  {nonWorkingDays.map((sch, idx) => (
                    <View key={idx} className={`${nonWorkingBg} border rounded-lg px-2 py-1 mr-2 mb-2`}>
                      <Text className={`text-xs ${nonWorkingText}`}>
                        {sch.dayOfWeek ? daysMap[sch.dayOfWeek] : sch.specificDate}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 px-4 mt-4 flex-row justify-center items-center shadow-md"
            onPress={() => navigation.navigate('BookAppointment', { professionalId: doctorData.id })}
          >
            <Icon name="calendar-alt" size={18} color="#ffffff" className="mr-2" />
            <Text className="text-white text-sm font-semibold">{t('doctor_profile.book_button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppContainer>
  );
}

