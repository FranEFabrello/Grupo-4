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
const NotificationItem = ({ item, fadeAnims, marcarNotificacionLeidaHandler, colorScheme, t }) => {
  const [itemHeight, setItemHeight] = React.useState(0);

  const renderRightActions = (id, height) => (
    <Animated.View
      style={{
        opacity: fadeAnims[id] || 1,
        height, // Usar la altura dinámica de la notificación
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() => marcarNotificacionLeidaHandler(id)}
        className="bg-green-500 justify-center items-center px-4 rounded-r-xl"
        style={{ height: '100%' }}
      >
        <MaterialCommunityIcons name="check" size={32} color="#fff" />
        <Text className="text-white text-xs mt-1">{t('notification.read_button')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
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
        renderRightActions={() => renderRightActions(item.id, itemHeight)}
        overshootRight={false}
      >
        <View
          className={`${colorScheme === 'light' ? 'bg-white' : 'bg-gray-700'} rounded-xl p-3 mb-4 shadow-sm flex-row items-center`}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setItemHeight(height); // Guardar la altura de la notificación
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
      // Guardar la notificación actual para restaurarla en caso de error
      const notificacionToRemove = notificacion.find(n => n.id === id);

      // Actualización optimista: eliminar la notificación inmediatamente
      setNotificacion(prev => prev.filter(n => n.id !== id));

      // Iniciar la animación de desvanecimiento
      Animated.timing(fadeAnims[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Limpiar la referencia de animación después de completarse
        delete fadeAnims[id];
      });

      // Llamada al backend
      const result = await dispatch(marcarNotificacionLeida(id));
      if (!result.error) {
        dispatch(markAsRead(id));
      } else {
        // Si hay un error, restaurar la notificación
        setNotificacion(prev => [...prev, notificacionToRemove].sort((a, b) => a.id - b.id));
        // Restaurar la animación
        fadeAnims[id] = new Animated.Value(1);
      }
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      // Restaurar la notificación en caso de error
      const notificacionToRemove = notificacion.find(n => n.id === id);
      setNotificacion(prev => [...prev, notificacionToRemove].sort((a, b) => a.id - b.id));
      fadeAnims[id] = new Animated.Value(1);
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
              <NotificationItem
                item={item}
                fadeAnims={fadeAnims}
                marcarNotificacionLeidaHandler={marcarNotificacionLeidaHandler}
                colorScheme={colorScheme}
                t={t}
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