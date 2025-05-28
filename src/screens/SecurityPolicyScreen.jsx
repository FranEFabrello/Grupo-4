import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import AppContainer from '~/components/AppContainer';

export default function SecurityPolicyScreen({ navigation }) {
  return (
    <AppContainer navigation={navigation} screenTitle="Política de Seguridad">
      <ScrollView className="flex-1 bg-gray-50 p-5">
        <View className="bg-white rounded-lg shadow-md p-5 mb-6">
          <Text className="text-2xl font-bold text-blue-700 mb-2">Política de Seguridad</Text>
          <Text className="text-base text-gray-700 mb-4">
            En nuestra aplicación, la seguridad y privacidad de tus datos es nuestra máxima prioridad. Nos comprometemos a proteger tu información personal y a garantizar que tus datos estén seguros en todo momento.
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">¿Cómo protegemos tus datos?</Text>
          <Text className="text-base text-gray-700 mb-2">
            - Utilizamos cifrado de extremo a extremo para proteger la transmisión de datos.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            - Tus contraseñas se almacenan de forma segura y nunca se comparten con terceros.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            - Solo el personal autorizado puede acceder a tu información, y únicamente para fines estrictamente necesarios.
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Tus derechos</Text>
          <Text className="text-base text-gray-700 mb-2">
            - Puedes solicitar la eliminación o modificación de tus datos personales en cualquier momento.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            - Tienes derecho a conocer qué información almacenamos sobre ti y cómo la utilizamos.
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Consejos de seguridad</Text>
          <Text className="text-base text-gray-700 mb-2">
            - No compartas tu contraseña con nadie.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            - Cambia tu contraseña periódicamente.
          </Text>
          <Text className="text-base text-gray-700 mb-2">
            - Si detectas actividad sospechosa, contáctanos de inmediato.
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-5">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Contacto</Text>
          <Text className="text-base text-gray-700 mb-2">
            Si tienes dudas o inquietudes sobre nuestra política de seguridad, puedes escribirnos a{' '}
            <Text
              className="text-blue-600 underline"
              onPress={() => Linking.openURL('mailto:soporte@app.com')}
            >
              soporte@app.com
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </AppContainer>
  );
}