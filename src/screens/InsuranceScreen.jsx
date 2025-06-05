import React, { useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsurance } from "~/store/slices/insuranceSlice";
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';
import '../i18n'; // Import your i18n configuration


export default function InsuranceScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.insurance);
  const insurance = useSelector((state) => state.insurance.insurance);
  const usuario = useSelector((state) => state.user.usuario);
  const { t, i18n } = useTranslation();
  const { colorScheme } = useAppTheme();

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const selectedButtonText = 'text-white';

  useEffect(() => {
    console.log("Id de la obra social: ", usuario.idObraSocial);
    if (usuario?.obraSocialId) {
      dispatch(fetchInsurance(usuario.obraSocialId));
      console.log('InsuranceScreen: ' + t('insurance.info_loading'), usuario.obraSocialId);
    }
  }, [dispatch, usuario?.obraSocialId]);

  return (
    <AppContainer navigation={navigation} screenTitle="Obra Social">
      <ScrollView className="p-5">
        <View className={`${containerBg} rounded-xl p-4 mb-4 shadow-md`}>
          <Text className={`text-lg font-semibold ${primaryText} mb-4`}>{t('insurance.section_title')}</Text>
          {status === 'loading' ? (
            <Text className={`text-sm ${secondaryText}`}>{t('global.alert.loading')}</Text>
          ) : insurance ? (
            <>
              <ProfileField label={t('insurance.fields.plan')} value={insurance.plan} />
              <ProfileField label={t('insurance.fields.type')} value={insurance.tipoObraSocial} />
              <ProfileField
                label={t('insurance.fields.plan')}
                value={insurance.plan}
                className="mb-2"
                labelClassName={primaryText}
                valueClassName={secondaryText}
              />
              <ProfileField
                label={t('insurance.fields.type')}
                value={insurance.tipoObraSocial}
                className="mb-2"
                labelClassName={primaryText}
                valueClassName={secondaryText}
              />
            </>
          ) : (
            <Text className={`text-sm ${secondaryText}`}>{t('insurance.no_info')}</Text>
          )}
        </View>
        <TouchableOpacity
          className={`${selectedButtonBg} rounded-xl py-3 px-4 mt-4 flex-row justify-center items-center shadow-md`}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text className={`${selectedButtonText} text-sm font-semibold`}>{t('global.button.return')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppContainer>
  );
}