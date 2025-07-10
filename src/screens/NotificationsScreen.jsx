import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import AppContainer from '../components/AppContainer';
import { fetchNotificaciones, marcarNotificacionLeida, markAsRead } from "~/store/slices/notificationSlice";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

// Componente para renderizar cada notificación
const NotificationItem = ({ item, fadeAnims, marcarNotificacionLeidaHandler, colorScheme, t, loading }) => {
  // Mover itemLayout a un estado local por cada card
  const [itemLayout, setItemLayout] = React.useState({ width: 0, height: 0 });

  // El renderRightActions debe ser una función estable por card
  const renderRightActions = (progress, dragX) => (
    <Animated.View
      style={{
        opacity: fadeAnims[item.id] || 1,
        height: itemLayout.height > 0 ? itemLayout.height : undefined,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() => marcarNotificacionLeidaHandler(item.id)}
        className="bg-green-500 justify-center items-center px-4 rounded-r-xl"
        style={{ height: itemLayout.height > 0 ? itemLayout.height : undefined, minHeight: 0 }}
      >
        <MaterialCommunityIcons name="check" size={32} color="#fff" />
        <Text className="text-white text-xs mt-1">{t('notification.read_button')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ position: 'relative' }}>
      <Animated.View
        style={{
          opacity: fadeAnims[item.id] || 1,
          transform: [
            {
              translateX: fadeAnims[item.id]?.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }) || 0,
            },
          ],
        }}
      >
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}
        >
          <View
            className={`${colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'} rounded-xl p-3 mb-4 shadow-sm flex-row items-center`}
            onLayout={e => {
              const { width, height } = e.nativeEvent.layout;
              setItemLayout({ width, height });
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
                <MaterialCommunityIcons name="check-circle" size={32} color={colorScheme === 'light' ? '#22C55E' : '#4ADE80'} />
              ) : item.logoNotificacion === "logo_cancelacion.png" ? (
                <MaterialCommunityIcons name="close-circle" size={32} color={colorScheme === 'light' ? '#EF4444' : '#F87171'} />
              ) : item.logoNotificacion === "logo_estudios.png" ? (
                <FontAwesome5 name="file-medical" size={28} color={colorScheme === 'light' ? '#3B82F6' : '#60A5FA'} />
              ) : item.logoNotificacion === "logo_reprogramacion.png" ? (
                <MaterialCommunityIcons name="calendar" size={32} color={colorScheme === 'light' ? '#F59E0B' : '#FBBF24'} />
              ) : item.logoNotificacion === "logo_receta.png" ? (
                <FontAwesome5 name="notes-medical" size={28} color={colorScheme === 'light' ? '#A21CAF' : '#D946EF'} />
              ) : (
                <MaterialCommunityIcons name="bell" size={32} color={colorScheme === 'light' ? '#6B7280' : '#9CA3AF'} />
              )}
            </View>

            <View className="flex-1">
              <Text className={`font-semibold text-base ${colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200'} mb-2`}>
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
              <Text className={`${colorScheme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>{item.mensaje}</Text>
              <View className="flex-row items-center mt-1 justify-between w-full">
                <Text className={`text-xs ${item.estado?.toLowerCase() === "no_leída" ? (colorScheme === 'light' ? 'text-blue-600' : 'text-blue-400') : (colorScheme === 'light' ? 'text-gray-700' : 'text-gray-400')}`}>
                  {item.estado?.toLowerCase() === "no_leída" ? t('notification.type.unread') : t('notification.type.read')}
                </Text>
              </View>
            </View>
          </View>
        </Swipeable>
      </Animated.View>
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, width: itemLayout.width, height: itemLayout.height, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
          <ActivityIndicator size="large" color={colorScheme === 'light' ? '#2563EB' : '#60A5FA'} />
        </View>
      )}
    </View>
  );
};

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.notifications || {});
  const notificaciones = useSelector(state => state.notifications?.notificaciones ?? []);
  const usuarioId = useSelector(state => state.user.usuario?.id);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();

  const [notificacion, setNotificacion] = React.useState([]);
  const [loadingIds, setLoadingIds] = React.useState([]);

  // Objeto para almacenar las referencias de animación por ID de notificación
  const fadeAnims = React.useRef({}).current;

  // Theme variables
  const containerBg = colorScheme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-700' : 'text-gray-400';
  const errorText = colorScheme === 'light' ? 'text-red-500' : 'text-red-400';
  const loaderColor = colorScheme === 'light' ? '#3B82F6' : '#60A5FA';

  useEffect(() => {
    if (usuarioId) {
      dispatch(fetchNotificaciones(usuarioId)).then((action) => {
        if (action.payload) {
          setNotificacion(action.payload);
          // Inicializar animaciones para cada notificación
          action.payload.forEach(item => {
            fadeAnims[item.id] = new Animated.Value(1);
          });
        }
      });
    }
  }, [dispatch, usuarioId]);

  const marcarNotificacionLeidaHandler = async (id) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      const notificacionToRemove = notificacion.find(n => n.id === id);
      const result = await dispatch(marcarNotificacionLeida(id));
      if (!result.error) {
        // Solo actualizar el contador, NO la lista global
        setNotificacion(prev => prev.filter(n => n.id !== id));
        Animated.timing(fadeAnims[id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          delete fadeAnims[id];
        });
        dispatch(markAsRead(id));
      } else {
        setNotificacion(prev => [...prev, notificacionToRemove].sort((a, b) => a.id - b.id));
        fadeAnims[id] = new Animated.Value(1);
      }
      setLoadingIds(prev => prev.filter(lid => lid !== id));
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      const notificacionToRemove = notificacion.find(n => n.id === id);
      setNotificacion(prev => [...prev, notificacionToRemove].sort((a, b) => a.id - b.id));
      fadeAnims[id] = new Animated.Value(1);
      setLoadingIds(prev => prev.filter(lid => lid !== id));
    }
  };

  return (
    <AppContainer navigation={navigation} screenTitle={t('notification.title')}>
      <View className={`flex-1 ${containerBg} p-5`}>
        {/* Solo mostrar loading global si la lista local está vacía */}
        {loading && notificacion.length === 0 && <ActivityIndicator size="large" color={loaderColor} />}
        {error && <Text className={`${errorText} mb-4`}>{error}</Text>}
        {!loading && !error && (
          <FlatList
            data={notificacion.filter(n => n.estado?.toUpperCase() === "NO_LEÍDA")}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }) => (
              <NotificationItem
                item={item}
                fadeAnims={fadeAnims}
                marcarNotificacionLeidaHandler={marcarNotificacionLeidaHandler}
                colorScheme={colorScheme}
                t={t}
                loading={loadingIds.includes(item.id)}
              />
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

