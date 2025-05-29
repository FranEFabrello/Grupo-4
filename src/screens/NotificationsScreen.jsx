import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppContainer from '../components/AppContainer';
import { fetchNotificaciones } from '~/store/slices/notificationSlice';
import { createSelector } from 'reselect';

//const selectNotificaciones = state => state.notificaciones?.notificaciones;

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.notifications || {});
  const notificaciones = useSelector(state => state.notifications?.notificaciones ?? []);
  const usuarioId = useSelector(state => state.user.usuario?.id);

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchNotificaciones(usuarioId));
    }
  }, [dispatch, usuarioId]);
  console.log('notificaciones en screen:', notificaciones);
  return (
    <AppContainer navigation={navigation} screenTitle="Notificaciones">
      <View className="flex-1 bg-gray-50 p-4">
        {loading && <ActivityIndicator size="large" color="#2563eb" />}
        {error && <Text className="text-red-500 mb-4">{error}</Text>}
        {!loading && !error && (
          <FlatList
            data={notificaciones}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }) => (
              <View className="bg-white rounded-lg p-4 mb-3 shadow flex-row items-center">
                <View className="mr-4">
                  {/* Si tienes la ruta local o remota de la imagen, usa Image */}
                  {/* <Image source={{ uri: item.logoNotificacion }} style={{ width: 40, height: 40 }} /> */}
                  <Text>{item.logoNotificacion}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1">
                    {item.tipoNotificacion === "CONFIRMACION_TURNO"
                      ? "Confirmación de turno"
                      : item.tipoNotificacion === "CANCELACION_TURNO"
                        ? "Cancelación de turno"
                        : item.tipoNotificacion}
                  </Text>
                  <Text className="text-gray-700">{item.mensaje}</Text>
                  <Text className={`text-xs mt-1 ${item.estado?.toLowerCase() === "no_leída" ? "text-blue-600" : "text-gray-400"}`}>
                    {item.estado?.toLowerCase() === "no_leída" ? "No leído" : "Leído"}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">No tienes notificaciones.</Text>
            }
          />
        )}
      </View>
    </AppContainer>
  );
};

export default NotificationsScreen;