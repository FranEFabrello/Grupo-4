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
  Picker
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from "react-redux";
import { fetchObrasSociales } from "~/store/slices/socialWorksSlice";
import { register } from '~/store/slices/autheticationSlice';

export default function RegisterScreen({ navigation }) {
  // Paso y estados de campos
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [repetirContrasenia, setRepetirContrasenia] = useState('');
  const [dni, setDni] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState('');
  const [celular, setCelular] = useState('');
  const [obraSocial, setObraSocial] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [errores, setErrores] = useState({});

  const obrasSociales = useSelector((state) => state.socialWork.obrasSociales);
  const dispatch = useDispatch();

  // Validaciones paso 1
  const validarPaso1 = () => {
    let err = {};
    if (!nombre) err.nombre = 'El nombre es obligatorio';
    if (!apellido) err.apellido = 'El apellido es obligatorio';
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = 'Email inválido';
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
    if (!celular) err.celular = 'El celular es obligatorio';
    if (!obraSocial) err.obraSocial = 'La obra social es obligatoria';
    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validarPaso1()) setStep(2);
  };
  const handleBack = () => setStep(1);

  const handleRegister = () => {
    if (!validarPaso2()) return;
    const userData = {
      nombre,
      apellido,
      email,
      contrasenia,
      dni,
      genero,
      fechaNacimiento,
      edad,
      celular,
      obraSocial,
      imagenPerfil,
    };

    console.log("Datos del usuario:", userData);
    dispatch(register(userData))
      .unwrap()
      .then(() => {
        Alert.alert('¡Registro exitoso!', 'Tu cuenta ha sido creada.');
        navigation.replace('Home');
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
        Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
      });
    console.log("Registrando usuario:", userData);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setImagenPerfil(result.assets[0].uri);
  };

  useEffect(() => {
    dispatch(fetchObrasSociales())
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center items-center p-5 bg-gray-100">
          <Text className="text-2xl font-bold mb-5 text-gray-800">Crear Cuenta</Text>
          {step === 1 ? (
            <>
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Nombre" value={nombre} onChangeText={setNombre} />
              {errores.nombre && <Text className="text-red-500 text-xs mb-1">{errores.nombre}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Apellido" value={apellido} onChangeText={setApellido} />
              {errores.apellido && <Text className="text-red-500 text-xs mb-1">{errores.apellido}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              {errores.email && <Text className="text-red-500 text-xs mb-1">{errores.email}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Contraseña" value={contrasenia} onChangeText={setContrasenia} secureTextEntry />
              {errores.contrasenia && <Text className="text-red-500 text-xs mb-1">{errores.contrasenia}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Repetir contraseña" value={repetirContrasenia} onChangeText={setRepetirContrasenia} secureTextEntry />
              {errores.repetirContrasenia && <Text className="text-red-500 text-xs mb-1">{errores.repetirContrasenia}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" />
              {errores.dni && <Text className="text-red-500 text-xs mb-1">{errores.dni}</Text>}
              <View className="w-full flex-row mb-2">
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center mr-1 ${genero==='M'?'border-blue-500 bg-blue-100':'border-gray-300 bg-white'}`} onPress={()=>setGenero('M')}><Text>Masculino</Text></TouchableOpacity>
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center mx-1 ${genero==='F'?'border-pink-500 bg-pink-100':'border-gray-300 bg-white'}`} onPress={()=>setGenero('F')}><Text>Femenino</Text></TouchableOpacity>
                <TouchableOpacity className={`flex-1 h-12 border rounded-lg justify-center items-center ml-1 ${genero==='O'?'border-purple-500 bg-purple-100':'border-gray-300 bg-white'}`} onPress={()=>setGenero('O')}><Text>Otros</Text></TouchableOpacity>
              </View>
              {errores.genero && <Text className="text-red-500 text-xs mb-1">{errores.genero}</Text>}
              <TextInput
                className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white"
                placeholder="Fecha de nacimiento (AAAA-MM-DD)"
                value={fechaNacimiento}
                onChangeText={(text) => {
                  // Elimina todo lo que no sea número ni guion
                  let cleaned = text.replace(/[^\d]/g, '');
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
              />
              {errores.fechaNacimiento && <Text className="text-red-500 text-xs mb-1">{errores.fechaNacimiento}</Text>}
              <TextInput className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white" placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
              {errores.edad && <Text className="text-red-500 text-xs mb-1">{errores.edad}</Text>}
              <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mt-2" onPress={handleNext}>
                <Text className="text-white text-base font-bold">Siguiente</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-2 bg-white"
                placeholder="Celular (11 1234 5678)"
                value={celular}
                onChangeText={(text) => {
                  // Elimina todo lo que no sea número
                  let cleaned = text.replace(/[^\d]/g, '');
                  // Aplica el formato 11 1234 5678
                  if (cleaned.length > 2 && cleaned.length <= 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
                  } else if (cleaned.length > 6) {
                    cleaned = cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 6) + ' ' + cleaned.slice(6, 10);
                  }
                  setCelular(cleaned);
                }}
                keyboardType="phone-pad"
              />
              <View className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white">
                <Picker
                  selectedValue={obraSocial}
                  onValueChange={setObraSocial}
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
              <TouchableOpacity className="w-full h-12 border border-gray-300 rounded-lg justify-center items-center mb-2 bg-white" onPress={pickImage}>
                <Text className="text-gray-700">{imagenPerfil ? 'Cambiar imagen de perfil' : 'Agregar imagen de perfil (opcional)'}</Text>
              </TouchableOpacity>
              {imagenPerfil && <Image source={{ uri: imagenPerfil }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }} />}
              <View className="flex-row w-full justify-between">
                <TouchableOpacity className="h-12 flex-1 bg-gray-300 rounded-lg justify-center items-center mr-2" onPress={handleBack}>
                  <Text className="text-gray-700 font-bold">Atrás</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-12 flex-1 bg-blue-600 rounded-lg justify-center items-center ml-2" onPress={handleRegister}>
                  <Text className="text-white font-bold">Registrarme</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity className="mt-6" onPress={() => navigation.replace('Login')}>
            <Text className="text-blue-600 text-sm">¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


/*

const obrasSociales = useSelector((state) => state.socialWork.obrasSociales);
  const dispatch = useDispatch();

  const handleRegister = () => {
    const userData = {
      nombre,
      apellido,
      dni,
      genero,
      fechaNacimiento,
      celular,
      obraSocial,
    };
    dispatch(register(userData))
      .unwrap()
      .then(() => {
        navigation.replace('Home');
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
        // Podés mostrar un mensaje al usuario con un Alert, por ejemplo.
      });
    console.log("Registrando usuario:", userData);
  };

useEffect(() => {
    dispatch(fetchObrasSociales());
  }, []);

<TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white"
        placeholder="Fecha de nacimiento (DD/MM/AAAA)"
        value={fechaNacimiento}
        onChangeText={setFechaNacimiento}
        keyboardType="numeric"
      />


* <View className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-3 bg-white">
        <Picker
          selectedValue={obraSocial}
          onValueChange={setObraSocial}
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
* */