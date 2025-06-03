import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from "~/store/slices/profileSlice";
import { cerrarSesion } from "~/store/slices/userSlice";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

export default function UserProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('');
  const [editable, setEditable] = useState(false);

  const { status, error } = useSelector((state) => state.user);
  const usuario = useSelector((state) => state.user.usuario);

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBg = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const avatarBg = colorScheme === 'light' ? 'bg-blue-50' : 'bg-gray-700';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-400';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const borderColor = colorScheme === 'light' ? 'border-gray-300' : 'border-blue-600';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-700';
  const selectedButtonText = 'text-white';
  const dangerButtonBg = colorScheme === 'light' ? 'bg-red-500' : 'bg-red-600';

  useEffect(() => {
    if (!usuario) {
      console.log('No se encontró usuario en el store');
      return;
    }
    console.log('Usuario desde el store:', usuario);
  }, [usuario]);

  useEffect(() => {
    console.log('Usuario desde el store en PERFILUSUARIO:', usuario);
    if (usuario) {
      setNombre(usuario.nombre || '');
      setApellido(usuario.apellido || '');
      setDni(usuario.dni || '');
      setCelular(usuario.celular || '');
      setGenero(usuario.genero || '');
    }
  }, [usuario]);

  const handleEdit = () => {
    if (!editable) {
      setEditable(true);
      return;
    }

    if (!usuario || !usuario.correo) {
      alert(t('user_profile.alerts.not_identified'));
      return;
    }

    const updates = {};
    if (nombre !== usuario.nombre) updates.nombre = nombre;
    if (apellido !== usuario.apellido) updates.apellido = apellido;
    if (dni !== usuario.dni) updates.dni = dni;
    if (celular !== usuario.celular) updates.celular = celular;
    if (genero !== usuario.genero) updates.genero = genero;

    if (Object.keys(updates).length === 0) {
      setEditable(false);
      alert(t('user_profile.alerts.no_changes'));
      return;
    }

    dispatch(updateProfile({ correo: usuario.correo, updates }))
      .unwrap()
      .then(() => {
        alert(t('user_profile.alerts.updated'));
        setEditable(false);
      })
      .catch(() => alert(t('user_profile.alerts.update_error')));
  };

  const handleLogout = () => {
    if (usuario && usuario.correo) {
      dispatch(cerrarSesion({ correo: usuario.correo }));
    } else {
      dispatch(cerrarSesion());
    }
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('user_profile.screen_title')}>
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {status === 'loading' ? (
          <Text className={`text-sm ${secondaryText}`}>{t('global.alert.loading')}</Text>
        ) : status === 'failed' ? (
          <View>
            <Text className={`text-sm text-red-600`}>{t('global.alert.load_error')} {error || 'Network error'}</Text>
          </View>
        ) : usuario ? (
          <>
            <View className="items-center mb-4">
              <View className={`w-24 h-24 ${avatarBg} rounded-full justify-center items-center mb-2`}>
                <Icon name="user" size={40} color={colorScheme === 'light' ? '#4a6fa5' : '#60a5fa'} />
              </View>
              <Text className={`text-lg font-semibold ${primaryText}`}>{`${nombre} ${apellido}`}</Text>
              <Text className={`text-sm ${secondaryText}`}>{usuario.correo}</Text>
            </View>

            <View className={`${containerBg} rounded-xl p-4 mb-4 shadow-md`}>
              <Text className={`text-base font-semibold ${primaryText} mb-4`}>{t('user_profile.edit_section_title')}</Text>

              <Text className={`text-sm ${primaryText} mb-1`}>{t('user_profile.fields.name')}</Text>
              <TextInput
                className={`rounded-xl ${inputBg} ${borderColor} border p-3 mb-2 text-sm ${editable ? primaryText : secondaryText}`}
                value={nombre}
                onChangeText={setNombre}
                editable={editable}
              />

              <Text className={`text-sm ${primaryText} mb-1`}>{t('user_profile.fields.lastName')}</Text>
              <TextInput
                className={`rounded-xl ${inputBg} ${borderColor} border p-3 mb-2 text-sm ${editable ? primaryText : secondaryText}`}
                value={apellido}
                onChangeText={setApellido}
                editable={editable}
              />

              <Text className={`text-sm ${primaryText} mb-1`}>{t('user_profile.fields.dni')}</Text>
              <TextInput
                className={`rounded-xl ${inputBg} ${borderColor} border p-3 mb-2 text-sm ${editable ? primaryText : secondaryText}`}
                value={dni}
                onChangeText={setDni}
                editable={editable}
              />

              <Text className={`text-sm ${primaryText} mb-1`}>{t('user_profile.fields.phone')}</Text>
              <TextInput
                className={`rounded-xl ${inputBg} ${borderColor} border p-3 mb-2 text-sm ${editable ? primaryText : secondaryText}`}
                value={celular}
                onChangeText={setCelular}
                editable={editable}
              />

              <Text className={`text-sm ${primaryText} mb-1`}>{t('user_profile.fields.gender.title')}</Text>
              <View className={`rounded-xl ${inputBg} ${borderColor} border p-2 mb-2`}>
                <Picker
                  selectedValue={genero}
                  onValueChange={setGenero}
                  enabled={editable}
                  style={{
                    height: 40,
                    color: colorScheme === 'light' ? '#1f2937' : '#e5e7eb',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Picker.Item label={t('user_profile.fields.gender.M')} value="masculino" />
                  <Picker.Item label={t('user_profile.fields.gender.F')} value="femenino" />
                  <Picker.Item label={t('user_profile.fields.gender.O')} value="otros" />
                </Picker>
              </View>

              <TouchableOpacity
                className={`${selectedButtonBg} rounded-xl p-3 flex-row justify-center mt-4`}
                onPress={handleEdit}
              >
                <Text className={`${selectedButtonText} text-sm font-semibold`}>
                  {editable ? t('user_profile.buttons.save') : t('user_profile.buttons.edit')}
                </Text>
              </TouchableOpacity>
            </View>

            <View className={`${containerBg} rounded-xl p-4 shadow-md`}>
              <TouchableOpacity
                className={`${dangerButtonBg} rounded-xl p-3 flex-row justify-center`}
                onPress={handleLogout}
              >
                <Text className={`${selectedButtonText} text-sm font-semibold`}>{t('user_profile.buttons.logout')}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </AppContainer>
  );
}