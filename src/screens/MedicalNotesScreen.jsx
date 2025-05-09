import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicalNotes } from '../store/slices/medicalNotesSlice';
import AppContainer from '../components/AppContainer';
import MedicalNote from '../components/MedicalNote';

export default function MedicalNotesScreen({ navigation, route }) {
  const { appointmentId } = route.params || {};
  const dispatch = useDispatch();
  const { notes, status } = useSelector((state) => state.medicalNotes);

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchMedicalNotes(appointmentId));
    }
  }, [dispatch, appointmentId]);

  return (
    <AppContainer navigation={navigation} screenTitle="Notas Médicas">
      <ScrollView className="p-5">
        {status === 'loading' ? (
          <Text className="text-sm text-gray-600">Cargando...</Text>
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
          <Text className="text-sm text-gray-600">No hay notas disponibles</Text>
        )}
      </ScrollView>
    </AppContainer>
  );
}