import React, { useState } from 'react';
      import { Alert, View, TextInput, Text, TouchableOpacity } from "react-native";
      import { useDispatch } from 'react-redux';
      import { validarTokenCambioContrasenia } from '~/store/slices/tokenSlice';
      import { solicitarCambioContrasenia, cambiarContrasenia } from '~/store/slices/userSlice';

      const ChangePasswordScreen = () => {
        const [correo, setCorreo] = useState('');
        const [nuevaContrasenia, setNuevaContrasenia] = useState('');
        const [repetirContrasenia, setRepetirContrasenia] = useState('');
        const [tokenValidado, setTokenValidado] = useState(false);
        const dispatch = useDispatch();

        const cambiarContraseniaHandler = async () => {
          if (!correo) {
            Alert.alert('Error', 'Completa el correo electrónico.');
            return;
          }
          try {
            await dispatch(solicitarCambioContrasenia({ correo })).unwrap();
            Alert.alert(
              'Éxito',
              'El correo fue enviado correctamente. Ahora ingresa el token recibido.',
              [
                {
                  text: 'Aceptar',
                  onPress: () => {
                    setTokenValidado(true);
                  },
                },
              ]
            );
          } catch (err) {
            Alert.alert('Error', err.mensaje || 'Error al solicitar el cambio de contraseña');
          }
        };

        const validarTokenHandler = async (token) => {
          try {
            const resValidacion = await dispatch(
              validarTokenCambioContrasenia({ correo, token })
            ).unwrap();
            Alert.alert('Éxito', resValidacion.mensaje);
            setTokenValidado(true);
          } catch (err) {
            Alert.alert('Error', err.mensaje || 'Token inválido');
          }
        };

        const guardarNuevaContrasenia = async () => {
          if (!nuevaContrasenia || !repetirContrasenia) {
            Alert.alert('Error', 'Completa ambos campos de contraseña.');
            return;
          }
          if (nuevaContrasenia !== repetirContrasenia) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
          }
          try {
            await dispatch(cambiarContrasenia({ correo, nuevaContrasenia })).unwrap();
            Alert.alert('Éxito', 'Contraseña cambiada correctamente.');
          } catch (err) {
            Alert.alert('Error', err.mensaje || 'Error al cambiar la contraseña');
          }
        };

        const [token, setToken] = useState('');

        return (
          <View className="flex-1 justify-center items-center p-5 bg-gray-100">
            <Text className="text-2xl font-bold mb-5 text-gray-800">Cambiar contraseña</Text>

            <TextInput
              className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!tokenValidado}
            />

            {!tokenValidado && (
              <>
                <TouchableOpacity
                  className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center mb-3"
                  onPress={cambiarContraseniaHandler}
                >
                  <Text className="text-white text-base font-bold">Solicitar token</Text>
                </TouchableOpacity>
                <TextInput
                  className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
                  placeholder="Token recibido"
                  value={token}
                  onChangeText={setToken}
                  keyboardType="default"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="w-full h-12 bg-blue-500 rounded-lg justify-center items-center mb-3"
                  onPress={() => validarTokenHandler(token)}
                >
                  <Text className="text-white text-base font-bold">Validar token</Text>
                </TouchableOpacity>
              </>
            )}

            {tokenValidado && (
              <>
                <TextInput
                  className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
                  placeholder="Nueva contraseña"
                  value={nuevaContrasenia}
                  onChangeText={setNuevaContrasenia}
                  secureTextEntry
                />
                <TextInput
                  className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
                  placeholder="Repetir nueva contraseña"
                  value={repetirContrasenia}
                  onChangeText={setRepetirContrasenia}
                  secureTextEntry
                />
                <TouchableOpacity
                  className="w-full h-12 bg-green-600 rounded-lg justify-center items-center mb-3"
                  onPress={guardarNuevaContrasenia}
                >
                  <Text className="text-white text-base font-bold">Guardar contraseña</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      };

      export default ChangePasswordScreen;