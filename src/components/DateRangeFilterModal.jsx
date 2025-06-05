import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AppointmentsCalendar from './AppointmentsCalendar';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '~/providers/ThemeProvider';

export default function DateRangeFilterModal({
                                               visible,
                                               startDate,
                                               endDate,
                                               onSelectDate,
                                               onApply,
                                               onClear,
                                               onClose,
                                               containerClassName,
                                               textClassName,
                                               buttonClassName,
                                               buttonTextClassName,
                                             }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const { colorScheme } = useAppTheme();

  // Theme variables
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable onPress={Keyboard.dismiss} className="flex-1 bg-black/20">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-[90%] self-center"
        >
          <View className={`${containerClassName} rounded-xl p-5`}>
            <Text className={`font-bold text-lg mb-5 ${textClassName}`}>
              {t('filter.filter_dates.title')}
            </Text>

            <View className="mb-5">
              <Text className={`font-bold mb-2.5 ${primaryText}`}>
                {t('filter.filter_dates.range')}
              </Text>

              <AppointmentsCalendar
                selectedDate={startDate}
                endDate={endDate}
                onSelectDate={onSelectDate}
                className={colorScheme === 'light' ? 'bg-white' : 'bg-gray-800'}
                textClassName={primaryText}
              />

              <View className="flex-row justify-between mt-2.5">
                <Text className={`${primaryText} text-sm`}>
                  {`${t('filter.filter_dates.start')}: ${startDate?.toLocaleDateString(i18n.language) || '-'}`}
                </Text>
                <Text className={`${primaryText} text-sm`}>
                  {`${t('filter.filter_dates.end')}: ${endDate?.toLocaleDateString(i18n.language) || '-'}`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className={`${buttonClassName} py-3 rounded-lg items-center`}
              onPress={onApply}
            >
              <Text className={`${buttonTextClassName} font-bold`}>{t('filter.filter_dates.apply')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-2.5 items-center"
              onPress={onClear}
            >
              <Text className={`${primaryText} font-bold`}>{t('filter.filter_dates.clear')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}