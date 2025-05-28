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
  Picker, useColorScheme
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from "react-redux";
import { fetchObrasSociales } from "~/store/slices/socialWorksSlice";
import { register } from '~/store/slices/autheticationSlice';
import { uploadImageToFirebase } from "~/api/FirebaseConfig";

export default function RegisterScreen({ navigation }) {
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
  const [edad, setEdad] = useState('');
  const [celular, setCelular] = useState('');
  const [obraSocial, setObraSocial] = useState('');
  const [idObraSocial, setIdObraSocial] = useState('');
  const [errores, setErrores] = useState({});

  const obrasSociales = useSelector((state) => state.socialWork.obrasSociales);
  const dispatch = useDispatch();

  //const [mostrarPopup, setMostrarPopup] = useState(false);
  //const [token, setToken] = useState('');

  const handleImageChange = async (imageResult) => {
    try {
      if (!imageResult.canceled) {
        const imageUri = imageResult.assets[0].uri;
        // Subir la imagen a Firebase y obtener la URL
        const url = await uploadImageToFirebase(imageUri);
        Seturlimagenperfil(url);
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
    if (!nombre) err.nombre = 'El nombre es obligatorio';
    if (!apellido) err.apellido = 'El apellido es obligatorio';
    if (!correo || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) err.correo = 'Correo inválido';
    if (!contrasenia || contrasenia.length < 6) err.contrasenia = 'Mínimo 6 caracteres';
    if (contrasenia !== repetirContrasenia) err.repetirContrasenia = 'Las contraseñas no coinciden';
    if (!dni) err.dni = 'El DNI es obligatorio';
    if (!genero) err.genero = 'Selecciona un género';
    if (!fechaNacimiento) err.fechaNacimiento = 'La fecha es obligatoria';
    if (!edad || isNaN(edad)) err.edad = 'Edad inválida';
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  // Validaciones paso 2
  const validarPaso2 = () => {
    let err = {};
    if (!celular) err.celular = 'El celular es obligatorio', console.log(err);
    if (!obraSocial) err.obraSocial = 'La obra social es obligatoria', console.log(err);
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validarPaso1()) setStep(2);
  };
  const handleBack = () => setStep(1);


  const handleRegister = () => {
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
      edad,
      celular,
      urlimagenperfil,
      rol: "PACIENTE"
    };

    console.log("Datos del usuario:", userData);
    dispatch(register(userData))
      .unwrap()
      .then(() => {
        navigation.navigate("ConfirmarToken", { email: correo });
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
        Alert.alert('Error en el registro', JSON.stringify(error));
      });
  };
 const [urlimagenperfil, Seturlimagenperfil] = useState(null);

  const pickImage = async () => {
    try {
      // Solicitar permisos para acceder a la galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
        return;
      }

      // Seleccionar la imagen
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      await handleImageChange(result);
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };


  useEffect(() => {
    if (!obrasSociales || obrasSociales.length === 0) {
      dispatch(fetchObrasSociales());
    }
  }, []);

  const { colorScheme } = useColorScheme();
  const containerBgClass = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const textClass = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const inputClass = colorScheme === 'light' ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-700 border-gray-600 text-gray-200';
  const errorTextClass = 'text-red-500';
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const { colorScheme } = useColorScheme();
  const errorTextClass = 'text-red-500';
  const linkClass = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className={`flex-1 justify-center items-center p-5 ${containerBgClass}`}>
          <Text className={`text-2xl font-bold mb-5 ${textClass}`}>Crear Cuenta</Text>
          {step === 1 ? (
            <>
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Nombre" value={nombre} onChangeText={setNombre} placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.nombre && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.nombre}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Apellido" value={apellido} onChangeText={setApellido} placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.apellido && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.apellido}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.correo && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.correo}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Contraseña" value={contrasenia} onChangeText={setContrasenia} secureTextEntry placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.contrasenia && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.contrasenia}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Repetir contraseña" value={repetirContrasenia} onChangeText={setRepetirContrasenia} secureTextEntry placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.repetirContrasenia && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.repetirContrasenia}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.dni && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.dni}</Text>}
              <View className="w-full flex-row mb-2">
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center mr-1 ${genero==='M'?`border-blue-500 ${colorScheme === 'light' ? 'bg-blue-100' : 'bg-blue-900'}`:`border-gray-300 ${colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'}`}`} onPress={()=>setGenero('M')}><Text className={textClass}>Masculino</Text></TouchableOpacity>
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center mx-1 ${genero==='F'?`border-pink-500 ${colorScheme === 'light' ? 'bg-pink-100' : 'bg-pink-900'}`:`border-gray-300 ${colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'}`}`} onPress={()=>setGenero('F')}><Text className={textClass}>Femenino</Text></TouchableOpacity>
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center ml-1 ${genero==='O'?`border-purple-500 ${colorScheme === 'light' ? 'bg-purple-100' : 'bg-purple-900'}`:`border-gray-300 ${colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'}`}`} onPress={()=>setGenero('O')}><Text className={textClass}>Otros</Text></TouchableOpacity>
              </View>
              {errores.genero && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.genero}</Text>}
              <TextInput
                className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`}
                placeholder="Fecha de nacimiento (AAAA-MM-DD)"
                value={fechaNacimiento}
                onChangeText={(text) => {
                  // Elimina todo lo que no sea número ni guion
                  let cleaned = text.replace(/[^\d]/g, ''); // Used /\\d/ in previous step, changing to /\d/
                  // Inserta los guiones automáticamente
                  if (cleaned.length > 4 && cleaned.length <= 6) {
                    cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
                  } else if (cleaned.length > 6) {
                    cleaned = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 6) + '-' + cleaned.slice(6, 8);
                  }
 setFechaNacimiento(cleaned);
                }}
                keyboardType="numeric"
                maxLength={10}
 placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}
              />
              {errores.fechaNacimiento && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.fechaNacimiento}</Text>}
              <TextInput className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}/>
              {errores.edad && <Text className={`text-xs mb-1 ${errorTextClass}`}>{errores.edad}</Text>}
              <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mt-2" onPress={handleNext}>
                <Text className="text-white text-base font-bold">Siguiente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                className={`w-full h-12 border rounded-lg px-3 mb-2 ${inputClass}`}
                placeholder="Celular (11 1234 5678)"
                value={celular}
                onChangeText={(text) => {
                  // Elimina todo lo que no sea número
                  let cleaned = text.replace(/[^\d]/g, ''); // Used /\\d/ in previous step, changing to /\d/
                  // Aplica el formato 11 1234 5678
                  if (cleaned.length > 2 && cleaned.length <= 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
                  } else if (cleaned.length > 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 6) + ' ' + cleaned.slice(6, 10);
                  }
                  setCelular(cleaned);
                }}
                keyboardType="phone-pad"
 placeholderTextColor={colorScheme === 'light' ? '#9CA3AF' : '#D1D5DB'}
              />
              <View className={`w-full h-12 border rounded-lg px-3 mb-3 ${colorScheme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700'}`}>
 {/* Picker component might need specific styling based on the platform and color scheme */}
                <Picker
                  style={{ color: colorScheme === 'light' ? '#1F2937' : '#D1D5DB' }}
                <Picker // Picker component might need specific styling based on the platform and color scheme
                  selectedValue={obraSocial}
                  onValueChange={(value) => {
                    setObraSocial(value);
                    setIdObraSocial(value);
                  }}
                >
                  {obrasSociales.map((obra) => (
                    <Picker.Item
                      key={obra.id}
                      label={`${obra.tipoObraSocial} - ${obra.plan}`}
                      value={obra.id}
                    />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity className={`w-full h-12 border rounded-lg justify-center items-center mb-2 ${colorScheme === 'light' ? 'border-gray-300 bg-white' : 'border-gray-600 bg-gray-700'}`} onPress={pickImage}>
                <Text className={`${colorScheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{urlimagenperfil ? 'Cambiar imagen de perfil' : 'Agregar imagen de perfil (opcional)'}</Text>
              </TouchableOpacity>
              {urlimagenperfil && <Image source={{ uri: urlimagenperfil }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }} onPress={handleImageChange} />}
              <View className="flex-row w-full justify-between">
                <TouchableOpacity className={`h-12 flex-1 rounded-lg justify-center items-center mr-2 ${colorScheme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} onPress={handleBack}>
                  <Text className={`font-bold ${colorScheme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Atrás</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-12 flex-1 bg-blue-600 rounded-lg justify-center items-center ml-2" onPress={handleRegister}>
                  <Text className="text-white font-bold">Registrarme</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity className="mt-6" onPress={() => navigation.replace('Login')}>
            <Text className={`text-sm ${linkClass}`}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}