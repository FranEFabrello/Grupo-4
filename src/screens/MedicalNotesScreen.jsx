import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import { fetchMedicalNotes } from '../store/slices/medicalNotesSlice';
import AppContainer from '../components/AppContainer';
import MedicalNote from '../components/MedicalNote';

export default function MedicalNotesScreen({ navigation, route }) {
  const { appointmentId } = route.params || {};
  const dispatch = useDispatch();
  const colorScheme = useColorScheme(); // Detecta el tema del sistema
  const { notes, status } = useSelector((state) => state.medicalNotes);

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchMedicalNotes(appointmentId));
    }
  }, [dispatch, appointmentId]);

  // Definir clases condicionales basadas en colorScheme
  const containerClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400'; // Secondary text color

  return (
    <AppContainer navigation={navigation} screenTitle="Notas Médicas">
      <ScrollView className={`p-5 ${containerClass}`}>
        {status === 'loading' ? (
          <Text className={`text-sm ${secondaryTextClass}`}>Cargando...</Text>
        ) : notes ? (
          <MedicalNote
            doctor={notes.doctor}
            date={notes.date}
            reason={notes.reason}
            diagnosis={notes.diagnosis}
            notes={notes.notes}
            prescription={notes.prescription}
            onDownload={() => alert(`Descargando ${notes.prescription}`)}
          />
        ) : (
          <Text className={`text-sm ${secondaryTextClass}`}>No hay notas disponibles</Text>
        )}
      </ScrollView>
    </AppContainer>
  );
}