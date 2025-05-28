import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { useDispatch, useSelector, useColorScheme } from 'react-redux';
import { fetchProfile, updateProfile } from "~/store/slices/profileSlice";
import { cerrarSesion } from "~/store/slices/userSlice";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContainer from '../components/AppContainer';
import ProfileField from '../components/ProfileField';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import { fetchUserByToken } from "~/store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfileScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  //const { usuario, status, error } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('');
  const [edad, setEdad] = useState('');
  const [foto, setFoto] = useState('');

  const [editable, setEditable] = useState(false);

  const {status, error} = useSelector((state) => state.user.usuario);
  const usuario = useSelector((state) => state.user.usuario);

  const containerBgClass = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const cardBgClass = colorScheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryTextClass = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const errorTextClass = 'text-red-600';
  const inputBorderClass = colorScheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputTextClass = colorScheme === 'light' ? '#1a202c' : '#d1d5db';
  const buttonClass = colorScheme === 'light' ? 'bg-blue-600' : 'bg-blue-800';
  const logoutButtonClass = colorScheme === 'light' ? 'bg-red-500' : 'bg-red-700';


  useEffect(() => {
    if (!usuario) {
      console.log('No se encontró usuario en el store');
      return;
    }
    console.log('Usuario desde el store:', usuario);
    // Aquí puedes usar usuario.id o cualquier otra propiedad necesaria
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
      alert("No se pudo identificar al usuario.");
      return;
    }

    // Detectar cambios para enviar sólo los campos actualizados
    const updates = {};
    if (nombre !== usuario.nombre) updates.nombre = nombre;
    if (apellido !== usuario.apellido) updates.apellido = apellido;
    if (dni !== usuario.dni) updates.dni = dni;
    if (celular !== usuario.celular) updates.celular = celular;
    if (genero !== usuario.genero) updates.genero = genero;

    if (Object.keys(updates).length === 0) {
      setEditable(false);
      alert("No se hicieron cambios.");
      return;
    }

    dispatch(updateProfile({ correo: usuario.correo, updates }))
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

  // Handler para cerrar sesión
  const handleLogout = () => {
    if (usuario && usuario.correo) {
      dispatch(cerrarSesion({ correo: usuario.correo }));
    } else {
      dispatch(cerrarSesion());
    }
  }

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

  return (
    <AppContainer navigation={navigation} screenTitle="Mi Perfil">
      <ScrollView
        className={`p-5 ${containerBgClass}`}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {status === 'loading' ? (
          <Text className={`text-sm ${secondaryTextClass}`}>Cargando...</Text>
        ) : status === 'failed' ? (
          <View>
            <Text className={`text-sm ${errorTextClass}`}>Error al cargar el perfil: {error || 'Network error'}</Text>
          </View>
        ) : usuario ? (
          <>
            <View className="items-center mb-4">
              <View className={`w-24 h-24 rounded-full justify-center items-center mb-2 ${colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`}>
                <Icon name="user" size={40} color="#4a6fa5" />
              </View>
              <Text className={`text-lg font-semibold ${textClass}`}>{`${nombre} ${apellido}`}</Text>
              <Text className={`text-sm ${secondaryTextClass}`}>{usuario.correo}</Text>
            </View>

            <View className={`${cardBgClass} rounded-lg p-4 mb-4 shadow-md`}>
              <Text className={`text-base font-semibold mb-4 ${textClass}`}>Editar Información Personal</Text>

              <Text className={`text-sm mt-2 ${textClass}`}>Nombre</Text>
              <TextInput
                className={`border-b mb-2 ${inputBorderClass}`}
                value={nombre}
                onChangeText={setNombre}
                editable={editable}
                style={{ color: editable ? inputTextClass : secondaryTextClass }}
              />

              <Text className="text-sm text-gray-800">Apellido</Text>
              <TextInput
                className={`border-b mb-2 ${inputBorderClass}`}
                value={apellido}
                onChangeText={setApellido}
                editable={editable}
                style={{ color: editable ? inputTextClass : secondaryTextClass }}
              />

              <Text className="text-sm text-gray-800">DNI</Text>
              <TextInput
                className={`border-b mb-2 ${inputBorderClass}`}
                value={dni}
                onChangeText={setDni}
                editable={editable}
                style={{ color: editable ? inputTextClass : secondaryTextClass }}
              />

              <Text className="text-sm text-gray-800">Celular</Text>
              <TextInput
                className={`border-b mb-2 ${inputBorderClass}`}
                value={celular}
                onChangeText={setCelular}
                editable={editable}
                style={{ color: editable ? inputTextClass : secondaryTextClass }}
              />

              <Text className="text-sm text-gray-800">Género</Text>
              <View className={`border-b mb-2 ${inputBorderClass}`}>
                <Picker
                  selectedValue={genero}
                  onValueChange={(itemValue) => setGenero(itemValue)}
                  style={{
                    height: 40,
                    color: editable ? inputTextClass : secondaryTextClass,
                    backgroundColor: 'transparent'
                  }}
                  enabled={editable}
                >
                  <Picker.Item label="Masculino" value="masculino" />
                  <Picker.Item label="Femenino" value="femenino" />
                  <Picker.Item label="Otros" value="otros" />
                </Picker>
              </View>

              <TouchableOpacity
                className={`${buttonClass} rounded-lg p-3 flex-row justify-center mt-4`}
                onPress={handleEdit}
              >
                <Text className="text-white text-sm">{editable ? "Guardar cambios" : "Editar perfil"}</Text>
              </TouchableOpacity>
            </View>

            <View className={`${cardBgClass} rounded-lg p-4 shadow-md`}>
              <TouchableOpacity
                className={`${logoutButtonClass} rounded-lg p-3 flex-row justify-center`}
                onPress={() => {handleLogout()}}
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
