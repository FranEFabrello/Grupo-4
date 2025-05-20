import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from "~/store/slices/profileSlice";
import { logout } from "~/store/slices/authSlice";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

export default function UserProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('');
  const [edad, setEdad] = useState('');

  const [editable, setEditable] = useState(false);



  useEffect(() => {
    const userId = profile?.id || 'defaultUserId'; // Reemplaza con la lógica para obtener el ID del usuario
    console.log(userId, "<- User id");
    dispatch(fetchProfile(userId));
  }, [dispatch]);


  /*
  useEffect(() => {
    if (profile) {
      setNotifications(profile.notifications || true);
      setDarkMode(profile.darkMode || false);
    }
  }, [profile]);*/
  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setApellido(profile.apellido || '');
      setDni(profile.dni || '');
      setCelular(profile.celular || '');
      setGenero(profile.genero || '');
    }
  }, [profile]);


  const handleEdit = () => {
    if (!editable) {
      setEditable(true);
      return;
    }

    if (!profile || !profile.correo) {
      alert("No se pudo identificar al usuario.");
      return;
    }

    // Detectar cambios para enviar sólo los campos actualizados
    const updates = {};
    if (nombre !== profile.nombre) updates.nombre = nombre;
    if (apellido !== profile.apellido) updates.apellido = apellido;
    if (dni !== profile.dni) updates.dni = dni;
    if (celular !== profile.celular) updates.celular = celular;
    if (genero !== profile.genero) updates.genero = genero;

    if (Object.keys(updates).length === 0) {
      alert("No se hicieron cambios.");
      return;
    }

    dispatch(updateProfile({ correo: profile.correo, updates }))
      .unwrap()
      .then(() => {
        alert("Información actualizada");
        setEditable(false);
      })
      .catch(() => alert("Error al actualizar la información"));
  };

  /*const handleEdit = () => {
    dispatch(updateProfile({ notifications, darkMode }));
    alert('Información actualizada');
  };*/

  const fallbackProfile = {
    name: 'Usuario de Prueba',
    email: 'usuario@prueba.com',
    dob: '01/01/1990',
    dni: '12345678',
    phone: '+54 9 11 1234-5678',
    address: 'Calle Falsa 123, Buenos Aires',
    notifications: true,
    darkMode: false,
  };

  //const profileData = profile || fallbackProfile;

  /*return (
    <AppContainer navigation={navigation} screenTitle="Mi Perfil">
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {status === 'loading' ? (
          <Text className="text-sm text-gray-600">Cargando...</Text>
        ) : status === 'failed' ? (
          <View>
            <Text className="text-sm text-red-600">Error al cargar el perfil: {error || 'Network error'}</Text>
            <Text className="text-sm text-gray-600 mt-2">Usando datos de prueba...</Text>
          </View>
        ) : (
          <>
            <View className="items-center mb-4">
              <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-2">
                <Icon name="user" size={40} color="#4a6fa5" />
              </View>
              <Text className="text-lg font-semibold text-gray-800">{profileData.name}</Text>
              <Text className="text-sm text-gray-600">{profileData.email}</Text>
            </View>
            <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <Text className="text-base font-semibold text-gray-800 mb-4">Información personal</Text>
              <ProfileField label="Nombre completo" value={profileData.name} />
              <ProfileField label="Fecha de nacimiento" value={profileData.dob} />
              <ProfileField label="DNI" value={profileData.dni} />
              <ProfileField label="Teléfono" value={profileData.phone} />
              <ProfileField label="Dirección" value={profileData.address} />
              <TouchableOpacity
                className="bg-blue-600 rounded-lg p-3 flex-row justify-center mt-4"
                onPress={handleEdit}
              >
                <Text className="text-white text-sm">Editar información</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <Text className="text-base font-semibold text-gray-800 mb-4">Configuración</Text>
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-800">Notificaciones</Text>
                  <Text className="text-xs text-gray-600">Recordatorios de turnos</Text>
                </View>
                <Switch value={notifications} onValueChange={setNotifications} />
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-800">Modo oscuro</Text>
                  <Text className="text-xs text-gray-600">Cambiar apariencia</Text>
                </View>
                <Switch value={darkMode} onValueChange={setDarkMode} />
              </View>
            </View>
            <View className="bg-white rounded-lg p-4 shadow-md">
              <TouchableOpacity
                className="bg-red-500 rounded-lg p-3 flex-row justify-center"
                onPress={() => dispatch(logout())}
              >
                <Text className="text-white text-sm">Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </AppContainer>
  );*/

  return (
    <AppContainer navigation={navigation} screenTitle="Mi Perfil">
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {status === 'loading' ? (
          <Text className="text-sm text-gray-600">Cargando...</Text>
        ) : status === 'failed' ? (
          <View>
            <Text className="text-sm text-red-600">Error al cargar el perfil: {error || 'Network error'}</Text>
          </View>
        ) : profile ? (
          <>

            <View className="items-center mb-4">
              <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-2">
                <Icon name="user" size={40} color="#4a6fa5" />
              </View>
              <Text className="text-lg font-semibold text-gray-800">{`${nombre} ${apellido}`}</Text>
              <Text className="text-sm text-gray-600">{profile.correo}</Text>
            </View>

            <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-2 overflow-hidden">
              <TouchableOpacity>
                <Icon name="user" size={40} color="#4a6fa5" />
                <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 50 }}>
                  <Icon name="pencil" size={16} color="#4a6fa5" />
                </View>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
              <Text className="text-base font-semibold text-gray-800 mb-4">Editar Información Personal</Text>

              <Text className="text-sm text-gray-800 mt-2">Nombre</Text>
              <TextInput className="border-b border-gray-300 mb-2" value={nombre} onChangeText={setNombre} editable={editable} />

              <Text className="text-sm text-gray-800">Apellido</Text>
              <TextInput className="border-b border-gray-300 mb-2" value={apellido} onChangeText={setApellido} editable={editable}/>

              <Text className="text-sm text-gray-800">DNI</Text>
              <TextInput className="border-b border-gray-300 mb-2" value={dni} onChangeText={setDni} editable={editable}/>

              <Text className="text-sm text-gray-800">Celular</Text>
              <TextInput className="border-b border-gray-300 mb-2" value={celular} onChangeText={setCelular} editable={editable}/>

              <Text className="text-sm text-gray-800">Género</Text>
              <View className="border-b border-gray-300 mb-2">
                <Picker
                  selectedValue={genero}
                  onValueChange={setGenero}
                  style={{ height: 40 }}
                >
                  <Picker.Item label="Masculino" value="masculino" />
                  <Picker.Item label="Femenino" value="femenino" />
                  <Picker.Item label="Otros" value="otros" />
                </Picker>
              </View>

              <TouchableOpacity
                className="bg-blue-600 rounded-lg p-3 flex-row justify-center mt-4"
                onPress={handleEdit}
              >
                <Text className="text-white text-sm">{editable ? "Guardar cambios" : "Editar perfil"}</Text>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-lg p-4 shadow-md">
              <TouchableOpacity
                className="bg-red-500 rounded-lg p-3 flex-row justify-center"
                onPress={() => dispatch(logout())}
              >
                <Text className="text-white text-sm">Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </AppContainer>
  );
}
