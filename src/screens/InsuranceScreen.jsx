import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsurance } from "~/store/slices/insuranceSlice";
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Import your i18n configuration

export default function InsuranceScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.insurance);
  const insurance = useSelector((state) => state.insurance.insurance);
  const usuario = useSelector((state) => state.user.usuario);
  const { t,i18n } = useTranslation();

  useEffect(() => {
    console.log("Id de la obra social: ",usuario.idObraSocial)
    if (usuario?.obraSocialId) {
      dispatch(fetchInsurance(usuario.obraSocialId));
      console.log('InsuranceScreen: ' + t('insurance.info_loading'), usuario.obraSocialId);
    }
  }, [dispatch, usuario?.obraSocialId]);

  return (
    <AppContainer navigation={navigation} screenTitle="Obra Social">
      <ScrollView className="p-5">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">{t('insurance.section_title')}</Text>
          {status === 'loading' ? (
            <Text className="text-sm text-gray-600">{t('global.alert.loading')}</Text>
          ) : insurance ? (
            <>
              <ProfileField label={t('insurance.fields.plan')} value={insurance.plan} />
              <ProfileField label={t('insurance.fields.type')} value={insurance.tipoObraSocial} />
            </>
          ) : (
            <Text className="text-sm text-gray-600">{t('insurance.no_info')}</Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-2 px-4 mt-4 flex-row justify-center items-center shadow-md"
          onPress={() => navigation.navigate('Profile')}
        >
          <Text className="text-white text-sm font-semibold">{t('global.button.return')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppContainer>
  );
}