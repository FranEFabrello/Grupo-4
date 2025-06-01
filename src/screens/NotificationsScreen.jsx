import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import AppContainer from '../components/AppContainer';
import { fetchNotificaciones, marcarNotificacionLeida } from "~/store/slices/notificationSlice";
import { createSelector } from 'reselect';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//const selectNotificaciones = state => state.notificaciones?.notificaciones;
import { useTranslation } from 'react-i18next';

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.notifications || {});
  const notificaciones = useSelector(state => state.notifications?.notificaciones ?? []);
  const usuarioId = useSelector(state => state.user.usuario?.id);
  const [selectedNotificationId, setSelectedNotificationId] = React.useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchNotificaciones(usuarioId));
    }
  }, [dispatch, usuarioId]);
  console.log('notificaciones en screen:', notificaciones);

  const marcarNotificacionLeidaHandler = (id) => {
    dispatch(marcarNotificacionLeida(id));
    setSelectedNotificationId(null);
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('notifications.title')}>
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
                  {item.logoNotificacion === "logo_confirmacion.png" ? (
                    <MaterialCommunityIcons name="check-circle" size={40} color="#22c55e" />
                  ) : item.logoNotificacion === "logo_cancelacion.png" ? (
                    <MaterialCommunityIcons name="close-circle" size={40} color="#ef4444" />
                  ) : item.logoNotificacion === "logo_estudios.png" ? (
                    <FontAwesome5 name="file-medical" size={40} color="#2563eb" />
                  ) : item.logoNotificacion === "logo_reprogramacion.png" ? (
                    <MaterialCommunityIcons name="calendar" size={40} color="#f59e42" />
                  ) : item.logoNotificacion === "logo_receta.png" ? (
                    <FontAwesome5 name="notes-medical" size={40} color="#a21caf" />
                  ) : (
                    <MaterialCommunityIcons name="bell" size={40} color="#6b7280" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1">
                    {item.tipoNotificacion === "CONFIRMACION_TURNO"
                      ? t('notification.book_confirmation')
                      : item.tipoNotificacion === "CANCELACION_TURNO"
                        ? t('notification.cancel_confirmation')
                        : item.tipoNotificacion}
                  </Text>
                  <Text className="text-gray-700">{item.mensaje}</Text>
                  <View className="flex-row items-center mt-1">
                    {item.estado?.toLowerCase() === "no_leída" && selectedNotificationId === item.id ? (
                      <TouchableOpacity
                        className="ml-2 flex-row items-center"
                        onPress={() => marcarNotificacionLeidaHandler(item.id)}
                      >
                        <MaterialCommunityIcons name="check" size={18} color="#22c55e" />
                        <Text className="ml-1 text-green-600 text-xs">Marcar como leída</Text>
                      </TouchableOpacity>
                    ) : item.estado?.toLowerCase() === "no_leída" ? (
                      <>
                        <Text className="text-xs text-blue-600">No leído</Text>
                        <TouchableOpacity
                          className="ml-2"
                          onPress={() => setSelectedNotificationId(item.id)}
                        >
                          <MaterialCommunityIcons name="check" size={18} color="#22c55e" />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text className="text-xs text-gray-400">Leído</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">{t('notification.empty')}</Text>
            }
          />
        )}
      </View>
    </AppContainer>
  );
};

export default NotificationsScreen;