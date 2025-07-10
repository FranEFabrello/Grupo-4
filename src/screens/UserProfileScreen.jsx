import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from "~/store/slices/profileSlice";
import { cerrarSesion } from "~/store/slices/userSlice";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToFirebase } from "~/api/FirebaseConfig";
import { logout } from "~/store/slices/authSlice";
import { showToast } from '~/components/ToastProvider';

export default function UserProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useAppTheme();
  const { t } = useTranslation();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('');
  const [urlImagenPerfil, setUrlImagenPerfil] = useState('');
  const [editable, setEditable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(null);

  const { status, error } = useSelector((state) => state.user);
  const usuario = useSelector((state) => state.user.usuario);

  const [isLoggingOut, setIsLoggingOut] = useState(false);


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
      //console.log('No se encontró usuario en el store');
      return;
    }
    //console.log('Usuario desde el store:', usuario);
  }, [usuario]);

  useEffect(() => {
    //console.log('Usuario desde el store en PERFILUSUARIO:', usuario);
    if (usuario) {
      setNombre(usuario.nombre || '');
      setApellido(usuario.apellido || '');
      setDni(usuario.dni || '');
      setCelular(usuario.celular || '');
      setGenero(usuario.genero || '');
      setUrlImagenPerfil(usuario.urlimagenperfil || '');
    } else {
      setNombre('');
      setApellido('');
      setDni('');
      setCelular('');
      setGenero('');
      setUrlImagenPerfil('');
    }
  }, [usuario]);

  const handleEdit = () => {
    if (!editable) {
      setEditable(true);
      return;
    }

    if (!usuario || !usuario.correo) {
      return;
    }

    const updates = {};
    if (nombre !== usuario.nombre) updates.nombre = nombre;
    if (apellido !== usuario.apellido) updates.apellido = apellido;
    if (dni !== usuario.dni) updates.dni = dni;
    if (celular !== usuario.celular) updates.celular = celular;
    if (genero !== usuario.genero) updates.genero = genero;

    if (Object.keys(updates).length === 0 && urlImagenPerfil === usuario.urlimagenperfil) {
      // No hay cambios, no permitir guardar
      return;
    }

    // Guardar los cambios pendientes y mostrar el modal
    setPendingUpdates({ ...updates, urlimagenperfil: urlImagenPerfil });
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    if (!pendingUpdates) return;
    dispatch(updateProfile(pendingUpdates))
      .unwrap()
      .then(() => {
        setEditable(false);
        setShowModal(false);
        setPendingUpdates(null);
        // Reiniciar la app
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
      })
      .catch(() => {
        setShowModal(false);
        setPendingUpdates(null);
      });
  };

  const handleCancelSave = () => {
    setShowModal(false);
    setPendingUpdates(null);
  };

  const handleCancelEdit = () => {
    setEditable(false);
    setNombre(usuario?.nombre || '');
    setApellido(usuario?.apellido || '');
    setDni(usuario?.dni || '');
    setCelular(usuario?.celular || '');
    setGenero(usuario?.genero || '');
    setUrlImagenPerfil(usuario?.urlimagenperfil || '');
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Limpiar AsyncStorage
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.clear();

      // Cerrar sesión en backend si corresponde
      if (usuario && usuario.id) {
        await dispatch(cerrarSesion(usuario.id)).unwrap();
      } else {
        await dispatch(cerrarSesion()).unwrap();
      }

      // Reiniciar el stack de navegación antes de limpiar el estado
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });

      // Limpiar estado de Redux después de navegar
      dispatch(logout());
      dispatch({ type: 'user/setUsuario', payload: null });
      dispatch({ type: 'user/setIsAuthenticated', payload: false });
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Aquí se puede manejar el error si es necesario
    } finally {
      setIsLoggingOut(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      await handleImageChange(result);
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      // Aquí se puede manejar el error si es necesario
    }
  };

  const handleImageChange = async (imageResult) => {
    try {
      if (!imageResult.canceled) {
        const imageUri = imageResult.assets[0].uri;
        const url = await uploadImageToFirebase(imageUri);
        setUrlImagenPerfil(url);

        if (usuario && usuario.correo) {
          //console.log("entrado a updateProfile para la imagen: ", url, imageUri);
          dispatch(updateProfile({ urlimagenperfil: url }))
            .unwrap()
            .then(() => {
              // Aquí se puede manejar el éxito si es necesario
            })
            .catch(() => {
              // Aquí se puede manejar el error si es necesario
            });
        }
      }
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
      // Aquí se puede manejar el error si es necesario
    }
  };

  // Modal de confirmación
  const renderModal = () => (
    showModal && (
      <View style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 24,
          width: '80%',
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            ¿Aplicar cambios?
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
            Si aplicas los cambios, la aplicación se reiniciará para reflejarlos.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#2563EB', borderRadius: 8, padding: 12, marginRight: 8 }}
              onPress={handleConfirmSave}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Aplicar y reiniciar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#6b7280', borderRadius: 8, padding: 12 }}
              onPress={handleCancelSave}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );

  return (
    <>
      {isLoggingOut && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 16,
            alignItems: 'center',
            flexDirection: 'row',
            gap: 12,
          }}>
            <Icon name="spinner" size={28} color="#2563EB" style={{ marginRight: 12 }} solid spin />
            <Text style={{ fontSize: 16, color: '#2563EB', fontWeight: 'bold' }}>
              {t('global.alert.loading')}
            </Text>
          </View>
        </View>
      )}
      <AppContainer navigation={navigation} screenTitle={t('user_profile.screen_title')}>
        {renderModal()}
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
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ position: 'relative' }}
                  onPress={pickImage}
                  accessibilityLabel={t('user_profile.buttons.edit_avatar')}
                >
                  <View className={`w-24 h-24 ${avatarBg} rounded-full justify-center items-center overflow-hidden mb-2`}>
                    {urlImagenPerfil || (usuario.urlimagenperfil && usuario.urlimagenperfil !== '') ? (
                      <Image
                        source={{ uri: urlImagenPerfil || usuario.urlimagenperfil }}
                        className="w-full h-full"
                        resizeMode="cover"
                        onError={() => console.log(t('user_profile.alerts.no_img'))}
                      />
                    ) : (
                      <Icon
                        name="user-circle"
                        size={96}
                        color={colorScheme === 'light' ? '#2563EB' : '#1E40AF'}
                        style={{ backgroundColor: '#000' }}
                      />
                    )}
                  </View>
                  <View style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    zIndex: 2,
                  }}>
                    <View
                      style={{
                        backgroundColor: colorScheme === 'light' ? '#2563EB' : '#1E40AF',
                        borderRadius: 20,
                        padding: 6,
                        elevation: 2,
                      }}
                    >
                      <Icon name="pencil-alt" size={18} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
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
                  onChangeText={(text) => setDni(text.replace(/\D/g, '').slice(0, 9))}
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
                <View
                  className={`rounded-xl ${inputBg} ${borderColor} border mb-2 mt-0`}
                  style={{ padding: 0, minHeight: 48, justifyContent: 'center', marginTop: 0 }}
                >
                  <Picker
                    selectedValue={genero}
                    onValueChange={setGenero}
                    enabled={editable}
                    style={{
                      minHeight: 48,
                      color: colorScheme === 'light' ? '#1f2937' : '#e5e7eb',
                      backgroundColor: 'transparent',
                      fontSize: 14,
                      paddingHorizontal: 12,
                      width: '100%',
                    }}
                    itemStyle={{
                      fontSize: 14,
                      minHeight: 48,
                    }}
                  >
                    <Picker.Item
                      label={t('user_profile.fields.gender.M')}
                      value="masculino"
                      color={colorScheme === 'light' ? '#1f2937' : '#000'}
                    />
                    <Picker.Item
                      label={t('user_profile.fields.gender.F')}
                      value="femenino"
                      color={colorScheme === 'light' ? '#1f2937' : '#000'}
                    />
                    <Picker.Item
                      label={t('user_profile.fields.gender.O')}
                      value="otros"
                      color={colorScheme === 'light' ? '#1f2937' : '#000'}
                    />
                  </Picker>
                </View>

                {editable ? (
                  (nombre !== usuario.nombre ||
                    apellido !== usuario.apellido ||
                    dni !== usuario.dni ||
                    celular !== usuario.celular ||
                    genero !== usuario.genero ||
                    urlImagenPerfil !== usuario.urlimagenperfil) ? (
                    <TouchableOpacity
                      className={`${selectedButtonBg} rounded-xl p-3 flex-row justify-center mt-4`}
                      onPress={handleEdit}
                    >
                      <Text className={`${selectedButtonText} text-sm font-semibold`}>
                        {t('user_profile.buttons.save')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className={`${selectedButtonBg} rounded-xl p-3 flex-row justify-center mt-4`}
                      onPress={handleCancelEdit}
                    >
                      <Text className={`${selectedButtonText} text-sm font-semibold`}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <TouchableOpacity
                    className={`${selectedButtonBg} rounded-xl p-3 flex-row justify-center mt-4`}
                    onPress={handleEdit}
                  >
                    <Text className={`${selectedButtonText} text-sm font-semibold`}>
                      {t('user_profile.buttons.edit')}
                    </Text>
                  </TouchableOpacity>
                )}
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
          ) : (
            <Text className={`text-sm ${secondaryText}`}>{t('user_profile.alerts.no_user')}</Text>
          )}
        </ScrollView>
      </AppContainer>
    </>
  );
}