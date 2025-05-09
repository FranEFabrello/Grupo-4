import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsurance } from '../store/slices/insuranceSlice';
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';

export default function InsuranceScreen({ navigation }) {
  const dispatch = useDispatch();
  const { insurance, status } = useSelector((state) => state.insurance);

  useEffect(() => {
    dispatch(fetchInsurance());
  }, [dispatch]);

  return (
    <AppContainer navigation={navigation} screenTitle="Obra Social">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Mi Obra Social</Text>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">Cargando...</Text>
          ) : insurance ? (
            <>
              <ProfileField label="Plan" value={insurance.plan} />
              <ProfileField label="Número de afiliado" value={insurance.affiliateNumber} />
              <ProfileField label="Titular" value={insurance.holder} />
              <ProfileField label="Vencimiento" value={insurance.expiration} />
              <TouchableOpacity
                className="bg-blue-600 rounded-lg p-3 flex-row justify-center"
                onPress={() => alert('Mostrando credencial')}
              >
                <Text className="text-white text-sm">Mostrar credencial</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text className="text-sm text-gray-600">No hay información disponible</Text>
          )}
        </View>
        {insurance?.coverage && (
          <View className="bg-white rounded-lg p-4 shadow-md">
            <Text className="text-base font-semibold text-gray-800 mb-4">Cobertura médica</Text>
            {insurance.coverage.map((item, index) => (
              <ProfileField key={index} label={item.label} value={item.value} />
            ))}
          </View>
        )}
      </ScrollView>
    </AppContainer>
  );
}