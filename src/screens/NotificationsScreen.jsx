import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import AppContainer from '../components/AppContainer';
import { fetchNotificaciones, marcarNotificacionLeida, markAsRead } from "~/store/slices/notificationSlice";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.notifications || {});
  const notificaciones = useSelector(state => state.notifications?.notificaciones ?? []);
  const usuarioId = useSelector(state => state.user.usuario?.id);
  const [selectedNotificationId, setSelectedNotificationId] = React.useState(null);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();

  const [notificacion, setNotificacion] = React.useState([]);

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const cardBg = colorScheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const accentText = colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400';
  const successText = colorScheme === 'light' ? 'text-green-600' : 'text-green-400';
  const errorText = colorScheme === 'light' ? 'text-red-500' : 'text-red-400';
  const iconConfirm = colorScheme === 'light' ? '#22C55E' : '#4ADE80';
  const iconCancel = colorScheme === 'light' ? '#EF4444' : '#F87171';
  const iconStudy = colorScheme === 'light' ? '#3B82F6' : '#60A5FA';
  const iconReschedule = colorScheme === 'light' ? '#F59E0B' : '#FBBF24';
  const iconPrescription = colorScheme === 'light' ? '#A21CAF' : '#D946EF';
  const iconDefault = colorScheme === 'light' ? '#6B7280' : '#9CA3AF';
  const loaderColor = colorScheme === 'light' ? '#3B82F6' : '#60A5FA';

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchNotificaciones(usuarioId)).then((action) => {
        if (action.payload) {
          setNotificacion(action.payload);
        }
      });
    }
  }, [dispatch, usuarioId]);

  const marcarNotificacionLeidaHandler = async (id) => {
    try {
      const result = await dispatch(marcarNotificacionLeida(id));
      if (!result.error) {
        setSelectedNotificationId(null);
        setNotificacion(prev =>
          prev.map(n =>
            n.id === id ? { ...n, estado: "LEÍDA" } : n
          )
        );
        dispatch(markAsRead(id));
      }
    } finally {
      setSelectedNotificationId(null);
    }
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('notification.title')}>
      <View className={`flex-1 ${containerBg} p-5`}>
        {loading && <ActivityIndicator size="large" color={loaderColor} />}
        {error && <Text className={`${errorText} mb-4`}>{error}</Text>}
        {!loading && !error && (
          <FlatList
            data={notificacion.filter(n => n.estado?.toUpperCase() === "NO_LEÍDA")}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`${cardBg} rounded-xl p-3 mb-4 shadow-sm flex-row items-center`}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.estado?.toLowerCase() === "no_leída") {
                    if (selectedNotificationId === item.id) {
                      marcarNotificacionLeidaHandler(item.id);
                    } else {
                      setSelectedNotificationId(item.id);
                    }
                  }
                }}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: colorScheme === 'light' ? '#fff' : '#374151',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 4,
                }}>
                  {item.logoNotificacion === "logo_confirmacion.png" ? (
                    <MaterialCommunityIcons name="check-circle" size={32} color={iconConfirm} />
                  ) : item.logoNotificacion === "logo_cancelacion.png" ? (
                    <MaterialCommunityIcons name="close-circle" size={32} color={iconCancel} />
                  ) : item.logoNotificacion === "logo_estudios.png" ? (
                    <FontAwesome5 name="file-medical" size={28} color={iconStudy} />
                  ) : item.logoNotificacion === "logo_reprogramacion.png" ? (
                    <MaterialCommunityIcons name="calendar" size={32} color={iconReschedule} />
                  ) : item.logoNotificacion === "logo_receta.png" ? (
                    <FontAwesome5 name="notes-medical" size={28} color={iconPrescription} />
                  ) : (
                    <MaterialCommunityIcons name="bell" size={32} color={iconDefault} />
                  )}
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold text-base ${primaryText} mb-2`}>
                    {item.tipoNotificacion === "CONFIRMACION_TURNO"
                      ? t('notification.book_confirmation')
                      : item.tipoNotificacion === "CANCELACION_TURNO"
                        ? t('notification.cancel_confirmation')
                        : item.tipoNotificacion === "ESTUDIOS_ENVIADOS"
                          ? t('notification.test_send')
                          : item.tipoNotificacion === "REPROGRAMACION_TURNO"
                            ? t('notification.rescheduel_appointment')
                            : item.tipoNotificacion === "RECETA_MEDICA"
                              ? t('notification.medical_note')
                              : item.tipoNotificacion === "RECETA_ENVIADA"
                                ? t('notification.medical_note_send')
                                : item.tipoNotificacion}
                  </Text>
                  <Text className={`${secondaryText}`}>{item.mensaje}</Text>
                  <View className="flex-row items-center mt-1 justify-between w-full">
                    {item.estado?.toLowerCase() === "no_leída" && selectedNotificationId === item.id ? (
                      <>
                        <Text className={`${successText} mr-2 text-xs`}>{t('notification.read_button')}</Text>
                        <MaterialCommunityIcons name="check" size={32} color={iconConfirm} />
                      </>
                    ) : item.estado?.toLowerCase() === "no_leída" ? (
                      <>
                        <Text className={`text-xs ${accentText}`}>{t('notification.type.unread')}</Text>
                        <MaterialCommunityIcons name="check" size={32} color={iconConfirm} style={{ marginLeft: 'auto' }} />
                      </>
                    ) : (
                      <Text className={`text-xs ${secondaryText} ml-auto`}>{t('notification.type.read')}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text className={`text-center ${secondaryText} mt-10`}>{t('notification.empty')}</Text>
            }
          />
        )}
      </View>
    </AppContainer>
  );
};

export default NotificationsScreen;