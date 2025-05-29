import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AppointmentsCalendar from './AppointmentsCalendar';
import { useTranslation } from 'react-i18next';

export default function DateRangeFilterModal({
  visible,
  startDate,
  endDate,
  onSelectDate,
  onApply,
  onClear,
  onClose,
}) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '90%' }}
          >
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>
                {t('appointments.filter_dates.filter_title')}
              </Text>

              <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#1F2937', fontWeight: 'bold', marginBottom: 10 }}>
                  {t('appointments.filter_dates.filter_range')}
                </Text>

                <AppointmentsCalendar
                  selectedDate={startDate}
                  endDate={endDate}
                  onSelectDate={onSelectDate}
                />

                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
                >
                  <Text style={{ color: '#2563EB' }}>
                    {startDate ? `${t('appointments.filter_dates.start')}: ${startDate.toLocaleDateString('es')}`
                      : `${t('appointments.filter_dates.start')}: -`}
                  </Text>
                  <Text style={{ color: '#2563EB' }}>
                    {endDate ? `${t('appointments.filter_dates.end')}: ${endDate.toLocaleDateString('es')}`
                      : `${t('appointments.filter_dates.end')}: -`}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#2563EB',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                onPress={onApply}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('appointments.filter_dates.apply_filter')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 10, alignItems: 'center' }}
                onPress={onClear}
              >
                <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>L{t('appointments.filter_dates.clear_filter')}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Pressable>
    </Modal>
  );
}