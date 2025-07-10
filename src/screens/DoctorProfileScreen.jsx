import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';
import { fetchProfessionals } from '~/store/slices/professionalsSlice';
import { fetchSpecialities } from '~/store/slices/medicalSpecialitiesSlice';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from "~/providers/ThemeProvider";

export default function DoctorProfileScreen({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { doctorId, doctor } = route.params;
  const { professionals, status: professionalsStatus } = useSelector((state) => state.professionals);
  const especialidades = useSelector((state) => state.medicalSpecialities.specialities);
  const { colorScheme } = useAppTheme();

  // Paleta y estilos
  const cardClass = colorScheme === 'light' ? 'bg-blue-50' : 'bg-gray-700';
  const textClass = colorScheme === 'light' ? 'text-gray-900' : 'text-gray-50';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const primaryButtonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  // Píldoras (todas iguales, sólo cambia icono y color del texto)
  const pillClass = colorScheme === 'light'
    ? 'bg-white border border-blue-200'
    : 'bg-gray-800 border border-blue-700';
  const pillTextClass = colorScheme === 'light'
    ? 'font-semibold text-base'
    : 'font-semibold text-base text-blue-200';

  const doctorData = doctor || professionals.find((prof) => prof.id === (doctorId || (doctor && doctor.id)));
  const specialty = especialidades.find((esp) => esp.id === doctorData?.idEspecialidad)?.descripcion || t('doctor_profile.no_specialty');

  useEffect(() => {
    if (!professionals?.length) dispatch(fetchProfessionals());
    if (!especialidades?.length) dispatch(fetchSpecialities());
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

  // Días
  const daysMap = {
    MONDAY: 'Lunes', TUESDAY: 'Martes', WEDNESDAY: 'Miércoles', THURSDAY: 'Jueves',
    FRIDAY: 'Viernes', SATURDAY: 'Sábado', SUNDAY: 'Domingo',
  };
  const weekDaysOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const allDays = weekDaysOrder.map((d) => {
    const w = (doctorData.schedules || []).find(sch => sch.dayOfWeek === d);
    if (!w) return { dayOfWeek: d, works: false };
    return w.nonWorkingDay
      ? { dayOfWeek: d, works: false }
      : { dayOfWeek: d, works: true, startTime: w.startTime, endTime: w.endTime };
  });

  // Rating: sólo si hay puntaje
  const renderRating = (rating) => {
    if (!rating || rating <= 0) return null;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i < rating ? "star" : "star-o"}
          size={20}
          color={colorScheme === 'light' ? "#2563eb" : "#60a5fa"}
          style={{
            marginRight: 2
          }}
        />
      );
    }
    return <View className="flex-row items-center mt-1 mb-2">{stars}</View>;
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('doctor_profile.title')}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 64 }}>
        <View className={`rounded-3xl p-6 mb-6 ${cardClass} shadow-2xl`}>
          {/* FOTO Y DATOS */}
          <View className="items-center mb-6">
            <View className="relative mb-2 items-center justify-center w-full">
              {/*<View
                className="absolute w-32 h-32 rounded-full bg-blue-200/40 dark:bg-blue-900/40 blur-xl"
                style={{ top: -10, left: '50%', marginLeft: -64 }}
              />*/}
              {doctorData.urlImagenDoctor ? (
                <Image
                  source={{ uri: doctorData.urlImagenDoctor }}
                  className="w-28 h-28 rounded-full border-4 border-blue-400 dark:border-blue-600 shadow-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-28 h-28 bg-gray-300 dark:bg-gray-700 rounded-full justify-center items-center border-4 border-blue-200 dark:border-blue-500 shadow-lg">
                  <Icon name="user-md" size={48} color="#4a6fa5" />
                </View>
              )}
            </View>
            <Text className={`text-2xl font-extrabold mt-2 ${textClass}`}>{`${doctorData.nombre} ${doctorData.apellido}`}</Text>
            <Text
              className={`text-lg mt-1 mb-1 font-semibold`}
              style={{
                color: colorScheme === 'light' ? '#3b82f6' : '#93c5fd'
              }}
            >
              {specialty}
            </Text>
            <View className="flex-row mt-1 gap-x-4">
              <Text className={`text-sm font-semibold ${secondaryTextClass} flex-row items-center`}>
                <Icon name="phone-alt" size={12} /> {doctorData.telefono}
              </Text>
              <Text className={`text-sm font-semibold ${secondaryTextClass} flex-row items-center`}>
                <Icon name="envelope" size={12} /> {doctorData.correo}
              </Text>
            </View>
            {renderRating(doctorData.calificacionPromedio)}
          </View>

          {/* INFO ADICIONAL */}
          <View className="mb-8">
            <Text className={`text-lg font-bold mb-2 ${textClass}`}>{t('doctor_profile.additional_info')}</Text>
            <Text className={`text-base font-medium ${secondaryTextClass}`}>
              {doctorData.informacionAdicional || t('doctor_profile.no_additional_info')}
            </Text>
          </View>

          {/* HORARIOS: PILLS TODOS IGUALES */}
          <View className="mb-6">
            <Text className={`text-lg font-bold mb-3 ${textClass}`}>{t('doctor_profile.consultation')}</Text>
            <View className="flex-row flex-wrap gap-2">
              {allDays.map((sch, idx) => (
                <View
                  key={sch.dayOfWeek}
                  className={`flex-row items-center px-4 py-2 rounded-xl min-w-[140px] justify-center ${pillClass} shadow-sm`}
                  style={{ minHeight: 44 }}
                >
                  <Icon
                    name={sch.works ? 'clock' : 'ban'}
                    size={16}
                    color={sch.works
                      ? (colorScheme === 'light' ? '#2563eb' : '#60a5fa')
                      : (colorScheme === 'light' ? '#ef4444' : '#fca5a5')
                    }
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={pillTextClass}
                    style={{
                      color: sch.works
                        ? (colorScheme === 'light' ? '#2563eb' : '#60a5fa')
                        : (colorScheme === 'light' ? '#ef4444' : '#fca5a5'),
                    }}
                  >
                    {daysMap[sch.dayOfWeek]}
                    {sch.works && sch.startTime && sch.endTime
                      ? ` ${sch.startTime.slice(0, 5)}-${sch.endTime.slice(0, 5)}`
                      : ''
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* BOTÓN PRINCIPAL */}
          <TouchableOpacity
            className={`mt-2 rounded-xl py-3 px-4 flex-row justify-center items-center shadow-lg ${primaryButtonClass}`}
            onPress={() => navigation.navigate('BookAppointment', { professionalId: doctorData.id })}
            activeOpacity={0.93}
          >
            <Icon name="calendar-alt" size={18} color="#fff" className="mr-2" />
            <Text className="text-white text-base font-extrabold">{t('doctor_profile.book_button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppContainer>
  );
}
