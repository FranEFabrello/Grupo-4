import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialities } from "~/store/slices/medicalSpecialitiesSlice";

import AppContainer from "../components/AppContainer";
import DoctorCard from "../components/DoctorCard";
import FilterButton from "../components/FilterButton";

import { fetchProfessionals } from "~/store/slices/professionalsSlice";

export default function ProfessionalsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { professionals, status } = useSelector((state) => state.professionals);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedEspecialidades, setSelectedEspecialidades] = useState([]);

  const especialidades = useSelector((state) => state.medicalSpecialities.specialities);

  useEffect(() => {
    dispatch(fetchProfessionals());
    dispatch(fetchSpecialities());
  }, [dispatch]);

  const filteredProfessionals = professionals
    .filter((prof) =>
      `${prof.nombre} ${prof.apellido} ${prof.informacionAdicional}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    .filter((prof) =>
      selectedEspecialidades.length > 0
        ? selectedEspecialidades.includes(prof.informacionAdicional)
        : true,
    )
    .filter((prof) =>
      selectedStars
        ? Math.round(prof.calificacion || 0) === selectedStars
        : true,
    );

  return (
    <AppContainer navigation={navigation} screenTitle="Profesionales">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Profesionales
          </Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 relative">
              <Icon
                name="search"
                size={16}
                color="#6c757d"
                className="absolute left-3 top-3"
              />
              <TextInput
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2"
                placeholder="Buscar profesional..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <FilterButton onPress={() => setShowFilterModal(true)} />
          </View>
          {/* Filtros seleccionados */}
          {(selectedEspecialidades.length > 0 || selectedStars) && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {selectedEspecialidades.map((esp) => (
                <View key={esp.id} style={{ backgroundColor: '#2563EB', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 }}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>{esp.descripcion}</Text>
                </View>
              ))}
              {selectedStars && (
                <View style={{ backgroundColor: '#2563EB', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12, marginRight: 4 }}>{selectedStars}</Text>
                  <Text style={{ color: '#FFD700', fontSize: 12 }}>★</Text>
                </View>
              )}
            </View>
          )}
          {status === "loading" ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : filteredProfessionals.length > 0 ? (
            <View className="flex-row flex-wrap justify-between gap-y-4">
              {filteredProfessionals.map((prof) => (
                <DoctorCard
                  key={prof.id}
                  name={`${prof.nombre} ${prof.apellido}`}
                  specialty={prof.informacionAdicional}
                  stars={prof.calificacionPromedio > 0 ? prof.calificacionPromedio : null}
                  noRating={prof.calificacionPromedio === 0}
                  onBook={() =>
                    navigation.navigate("BookAppointment", {
                      professionalId: prof.id,
                    })
                  }
                  containerClassName="w-[48%]"
                />
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-600">
              No hay profesionales disponibles
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Filtrar por especialidad</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {especialidades.map((esp) => (
                <TouchableOpacity
                  key={esp.id}
                  style={{
                    padding: 10,
                    backgroundColor: selectedEspecialidades.some(e => e.id === esp.id) ? '#2563EB' : '#E5E7EB',
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  onPress={() => {
                    setSelectedEspecialidades((prev) =>
                      prev.some(e => e.id === esp.id)
                        ? prev.filter((e) => e.id !== esp.id)
                        : [...prev, { id: esp.id, descripcion: esp.descripcion }]
                    );
                  }}
                >
                  <Text style={{ color: selectedEspecialidades.some(e => e.id === esp.id) ? '#fff' : '#1F2937' }}>
                    {esp.descripcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ height: 2, backgroundColor: '#2563EB', marginBottom: 20 }} />

            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Filtrar por estrellas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: selectedStars === star ? '#2563EB' : '#E5E7EB',
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  onPress={() => setSelectedStars(star)}
                >
                  <Text style={{ color: selectedStars === star ? '#fff' : '#1F2937', marginRight: 5 }}>{star}</Text>
                  <Text style={{ color: selectedStars === star ? '#FFD700' : '#A0AEC0' }}>★</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ height: 2, backgroundColor: '#2563EB', marginVertical: 20 }} />

            <TouchableOpacity
              style={{
                backgroundColor: '#2563EB',
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
              }}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Aplicar filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                setSelectedEspecialidades([]);
                setSelectedStars(null);
                setShowFilterModal(false);
              }}
            >
              <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AppContainer>
  );
}