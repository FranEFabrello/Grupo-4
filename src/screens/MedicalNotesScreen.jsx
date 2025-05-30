import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContainer from '../components/AppContainer';

export default function MedicalNotesScreen({ route, navigation }) {
  const { appointment } = route.params;
  const colorScheme = useColorScheme();

  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const labelClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const cardClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-700';

  const handleDownload = () => {
    if (appointment.archivoAdjunto) {
      Linking.openURL(appointment.archivoAdjunto).catch(() => {
        Alert.alert('Error', 'No se pudo abrir el enlace de la receta médica.');
      });
    }
  };

  return (
    <AppContainer navigation={navigation} screenTitle="Notas Médicas">
      <ScrollView className={`flex-1 ${containerClass}`}>
        <View className="p-5">
          {/* Datos del médico */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="user-md" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>Profesional</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {appointment.doctorInfo
                ? `Dr. ${appointment.doctorInfo.nombre} ${appointment.doctorInfo.apellido}`
                : 'Sin asignar'}
            </Text>
            <Text className={`text-base ${textClass}`}>
              {appointment.especialidadInfo?.descripcion || 'Sin especialidad'}
            </Text>
          </View>

          {/* Fecha del turno */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="calendar-alt" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>Fecha y Hora</Text>
            </View>
            <Text className={`text-lg font-medium ${textClass}`}>
              {new Date(appointment.fecha).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text className={`text-lg font-medium ${textClass}`}>
              {`${appointment.horaInicio} - ${appointment.horaFin}`}
            </Text>
          </View>

          {/* Motivo del turno */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="comment-medical" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>Motivo de la consulta</Text>
            </View>
            <Text className={`text-base ${textClass}`}>
              {appointment.nota || 'Sin motivo especificado'}
            </Text>
          </View>

          {/* Diagnóstico */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="notes-medical" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>Diagnóstico</Text>
            </View>
            <Text className={`text-base ${textClass}`}>
              {appointment.diagnostico || 'Sin diagnóstico registrado'}
            </Text>
          </View>

          {/* Notas médicas */}
          <View className={`mb-4 rounded-xl p-4 ${cardClass}`}>
            <View className="flex-row items-center mb-3">
              <Icon name="file-medical-alt" size={18} color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
              <Text className={`ml-2 ${labelClass}`}>Notas médicas</Text>
            </View>
            <Text className={`text-base ${textClass}`}>
              {appointment.notaDoctor || 'Sin notas médicas'}
            </Text>
          </View>

          {/* Archivo adjunto (receta médica) */}
          {appointment.archivoAdjunto && (
            <TouchableOpacity
              className="bg-blue-600 rounded-xl p-4 flex-row justify-center items-center shadow-sm mb-4"
              onPress={handleDownload}
            >
              <Icon name="file-download" size={20} color="white" />
              <Text className="text-white text-base font-medium ml-2">
                Descargar receta médica
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </AppContainer>
  );
}

