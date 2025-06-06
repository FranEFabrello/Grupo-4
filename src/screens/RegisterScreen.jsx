import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator          // ⬅️ nuevo
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from "react-redux";
import { fetchObrasSociales } from "~/store/slices/socialWorksSlice";
import { register } from '~/store/slices/autheticationSlice';
import { uploadImageToFirebase } from "~/api/FirebaseConfig";
import LoadingOverlay from "~/components/LoadingOverlay";   // ⬅️ overlay
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function RegisterScreen({ navigation }) {
  const { colorScheme } = useAppTheme();
  // Paso y estados de campos
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [dni, setDni] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [celular, setCelular] = useState('');
  const [obraSocial, setObraSocial] = useState('');   // nombre
  const [idObraSocial, setIdObraSocial] = useState(''); // id
  const [urlImagenPerfil, SetUrlImagenPerfil] = useState(null);
  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);        // ⬅️ estado carga
  const { t } = useTranslation();

  const obrasSociales = useSelector((state) => state.socialWork.obrasSociales);
  //console.log('obrasSociales en RegisterScreen:', obrasSociales);
  const dispatch = useDispatch();

  //const [mostrarPopup, setMostrarPopup] = useState(false);
  //const [token, setToken] = useState('');

  const handleImageChange = async (imageResult) => {
    try {
      if (!imageResult.canceled) {
        const imageUri = imageResult.assets[0].uri;
        // Subir la imagen a Firebase y obtener la URL
        const url = await uploadImageToFirebase(imageUri);
        SetUrlImagenPerfil(url);
        console.log('URL de la imagen subida:', url);
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Por favor, intenta de nuevo.');
    }
  };

  // Validaciones paso 1
  const validarPaso1 = () => {
    let err = {};
    if (!nombre) err.nombre = t('register.errors.name');
    if (!apellido) err.apellido = t('register.errors.lastName');
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) err.correo = t('register.errors.email');
    if (!contrasenia || contrasenia.length < 6) err.contrasenia = t('register.errors.password');
    if (contrasenia !== repetirContrasenia) err.repetirContrasenia = t('register.errors.repeat_password');
    if (!dni) err.dni = t('register.errors.repeat_password');
    if (!genero) err.genero = t('register.errors.gender');
    if (!fechaNacimiento) err.fechaNacimiento = t('register.errors.birth_date');
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  // Validaciones paso 2
  const validarPaso2 = () => {
    let err = {};
    if (!celular) err.celular = t('register.errors.phone'), console.log(err);
    if (!obraSocial) err.obraSocial = t('register.errors.insurance'), console.log(err);
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validarPaso1()) setStep(2);
  };
  const handleBack = () => setStep(1);


  const handleRegister = async () => {                      // ⬅️ ahora async
    console.log("handleRegister fue ejecutado"); // <- PRUEBA
    if (!validarPaso2()) {
      console.log("validarPaso2 falló");        // <- PRUEBA
      return;
    }

    const userData = {
      nombre,
      apellido,
      correo,
      contrasenia,
      dni,
      genero,
      fechaNacimiento,
      celular,
      idObraSocial,
      urlImagenPerfil,
      rol: "PACIENTE"
    };

    console.log("Datos del usuario:", userData);

    try {
      setIsLoading(true);                                    // ⬅️ inicia carga
      await dispatch(register(userData)).unwrap();
      navigation.navigate("ConfirmarToken", { email: correo });
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert(t('register.errors.default_error'), JSON.stringify(error));
    } finally {
      setIsLoading(false);                                   // ⬅️ finaliza carga
    }
  };

  const pickImage = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(t('global.alert.denied_access'), t('global.alert.denied_access_message'));
        return;
      }

      // Seleccionar la imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',        // ← nueva sintaxis
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      await handleImageChange(result);
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', t('global.alert.no_selected_image'));
    }
  };


  useEffect(() => {
    if (!obrasSociales || obrasSociales.length === 0) {
      dispatch(fetchObrasSociales());
    }
  }, []);

  // Color de texto dinámico para los <Picker>
  const pickerTextColor = colorScheme === 'dark' ? '#F3F4F6' : '#1F2937';

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className={`flex-1 justify-center items-center p-5 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <Text className={`text-2xl font-bold mb-5 ${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{t('register.title')}</Text>
          {step === 1 ? (
            <>
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.name')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={nombre} onChangeText={setNombre} />
              {errores.nombre && <Text className="text-red-500 text-xs mb-1">{errores.nombre}</Text>}
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.lastName')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={apellido} onChangeText={setApellido} />
              {errores.apellido && <Text className="text-red-500 text-xs mb-1">{errores.apellido}</Text>}
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.email')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
              {errores.correo && <Text className="text-red-500 text-xs mb-1">{errores.correo}</Text>}
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.password')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={contrasenia} onChangeText={setContrasenia} secureTextEntry />
              {errores.contrasenia && <Text className="text-red-500 text-xs mb-1">{errores.contrasenia}</Text>}
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.repeat_password')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={repetirContrasenia} onChangeText={setRepetirContrasenia} secureTextEntry />
              {errores.repetirContrasenia && <Text className="text-red-500 text-xs mb-1">{errores.repetirContrasenia}</Text>}
              <TextInput className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`} placeholder={t('register.placeholders.dni')} placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} value={dni} onChangeText={setDni} keyboardType="numeric" />
              {errores.dni && <Text className="text-red-500 text-xs mb-1">{errores.dni}</Text>}
              <View className="w-full flex-row mb-2">
                <TouchableOpacity
                  className={`flex-1 h-12 border rounded-lg justify-center items-center mr-1 ${
                    genero === 'M'
                      ? 'border-blue-500 bg-blue-200'
                      : colorScheme === 'dark'
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setGenero('M')}
                >
                  <Text className={colorScheme === 'dark' ? 'text-gray-100' : ''}>{t('register.gender.M')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 h-12 border rounded-lg justify-center items-center mx-1 ${
                    genero === 'F'
                      ? 'border-pink-500 bg-pink-200'
                      : colorScheme === 'dark'
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setGenero('F')}
                  >
                    <Text className={colorScheme === 'dark' ? 'text-gray-100' : ''}>{t('register.gender.F')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 h-12 border rounded-lg justify-center items-center ml-1 ${
                    genero === 'O'
                        ? 'border-purple-500 bg-purple-200'
                      : colorScheme === 'dark'
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => setGenero('O')}
                >
                  <Text className={colorScheme === 'dark' ? 'text-gray-100' : ''}>{t('register.gender.O')}</Text>
                </TouchableOpacity>
              </View>
              {errores.genero && <Text className="text-red-500 text-xs mb-1">{errores.genero}</Text>}
              <TextInput
                className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`}
                placeholder="Fecha de nacimiento (AAAA-MM-DD)"
                placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                value={fechaNacimiento}
                onChangeText={(text) => {
                  let cleaned = text.replace(/[^\d]/g, '');
                  if (cleaned.length > 4 && cleaned.length <= 6) {
                    cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
                  } else if (cleaned.length > 6) {
                    cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 6) + '-' + cleaned.slice(6, 8);
                  }
                  setFechaNacimiento(cleaned);
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              {errores.fechaNacimiento && <Text className="text-red-500 text-xs mb-1">{errores.fechaNacimiento}</Text>}
              <TouchableOpacity
                className={`w-full h-12 rounded-xl justify-center items-center mt-4 shadow-md ${
                  'bg-blue-600'
                }`}
                activeOpacity={0.8}
                onPress={handleNext}
              >
                <Text className="text-white font-semibold">{t('global.next')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                className={`w-full h-12 border ${colorScheme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg px-3 mb-2`}
                placeholder={t('register.placeholders.phone')}
                placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                value={celular}
                onChangeText={(text) => {
                  let cleaned = text.replace(/[^\d]/g, '');
                  if (cleaned.length > 2 && cleaned.length <= 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
                  } else if (cleaned.length > 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 6) + ' ' + cleaned.slice(6, 10);
                  }
                  setCelular(cleaned);
                }}
                keyboardType="phone-pad"
              />
              {/* Selector de obra social */}
              <Picker
                mode="dropdown"
                selectedValue={idObraSocial}
                dropdownIconColor={colorScheme === 'dark' ? '#f3f4f6' : '#4b5563'}
                onValueChange={(value, _index) => {
                  setIdObraSocial(value);
                  const selectedOS = obrasSociales.find((o) => o.id === value);
                  const nombreOS = selectedOS ? `${selectedOS.tipoObraSocial} - ${selectedOS.plan}` : '';
                  setObraSocial(nombreOS); // Guardar el nombre completo, ej: "OSDE - Plan A"
                }}
                style={{
                  color: colorScheme === 'dark' ? '#ffffff' : '#000000', // Texto blanco en modo oscuro, negro en modo claro
                  backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff', // Fondo consistente
                  borderColor: colorScheme === 'dark' ? '#374151' : '#d1d5db',
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 8,
                  height: 48,
                  width: '100%',
                  paddingHorizontal: 10, // Padding para mejor presentación
                }}
                itemStyle={{
                  fontSize: 16, // Tamaño de fuente legible
                  color: colorScheme === 'dark' ? '#ffffff' : '#000000', // Color de las opciones
                }}
              >
                <Picker.Item
                  enabled={false}
                  label={t('register.placeholders.choose_insurance')}
                  value=""
                  color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} // Color del placeholder
                />
                {obrasSociales.map((os) => (
                  <Picker.Item
                    key={os.id}
                    label={`${os.tipoObraSocial} - ${os.plan}`} // Mostrar "OSDE - Plan A", "SANCOR_SALUD - 2500", etc.
                    value={os.id}
                    color={colorScheme === 'dark' ? '#ffffff' : '#000000'} // Color del texto de las opciones
                  />
                ))}
              </Picker>
              {errores.obraSocial && <Text className="text-red-500 text-xs mb-1">{errores.obraSocial}</Text>}
              <Text className="text-gray-500 mt-2">
                Obra Social seleccionada: {obraSocial || 'Ninguna'}
              </Text>
              <TouchableOpacity className={`w-full h-12 border rounded-lg justify-center items-center mb-2 ${colorScheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`} onPress={pickImage}>
                <Text className={colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-700'}>{urlImagenPerfil ? t('register.buttons.change_img') : t('register.buttons.add_img')}</Text>
              </TouchableOpacity>
              {urlImagenPerfil && <Image source={{ uri: urlImagenPerfil }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }} onPress={handleImageChange} />}
              <TouchableOpacity
                className={`w-full h-12 rounded-xl justify-center items-center mt-4 shadow-md bg-blue-500`}
                activeOpacity={0.8}
                onPress={handleBack}
              >
                <Text className="text-white font-semibold">{t('global.back')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isLoading}
                activeOpacity={0.8}
                className={`w-full h-12 rounded-xl justify-center items-center mt-4 shadow-md ${
                  isLoading ? 'bg-blue-400 opacity-80' : 'bg-blue-600'
                }`}
                onPress={handleRegister}
              >
                {isLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text className="text-white font-semibold">{t('register.submit_button')}</Text>
                }
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity className="mt-6" onPress={() => navigation.replace('Login')}>
            <Text className="text-blue-600 text-sm">{t('register.footer.login_redirect')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Overlay de carga global */}
      {isLoading && <LoadingOverlay />}
    </KeyboardAvoidingView>
  );
}