import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '~/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';

export default function ProfileField({
                                       label,
                                       type = 'text',
                                       value,
                                       onChange,
                                       items = [],
                                       disabled,
                                       className,
                                       labelClassName,
                                       valueClassName,
                                     }) {
  const { colorScheme } = useAppTheme();
  const { t } = useTranslation();

  // Theme variables
  const primaryText = colorScheme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const secondaryText = colorScheme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const inputBg = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const pickerBg = colorScheme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const borderColor = colorScheme === 'light' ? 'border-gray-300' : 'border-gray-700';
  const selectedButtonBg = colorScheme === 'light' ? 'bg-blue-500' : 'bg-blue-400';

  return (
    <View className={`mb-6 w-full ${className}`}>
      <Text className={`text-base font-semibold mb-2 ${primaryText} ${labelClassName}`}>{label}</Text>
      {type === 'picker' ? (
        <View className={`rounded-xl border ${borderColor} ${pickerBg} px-4 py-3 ${disabled ? 'opacity-50' : ''} shadow-sm`}>
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            enabled={!disabled}
            style={{
              color: colorScheme === 'light' ? '#1f2937' : '#e5e7eb',
              fontSize: 16,
              backgroundColor: colorScheme === 'light' ? '#f9fafb' : '#1f2937',
            }}
            dropdownIconColor={colorScheme === 'light' ? '#3b82f6' : '#60a5fa'}
            itemStyle={{
              color: colorScheme === 'light' ? '#1f2937' : '#e5e7eb',
              backgroundColor: colorScheme === 'light' ? '#ffffff' : '#374151',
              fontSize: 16,
            }}
          >
            <Picker.Item
              label={`${t('global.button.select')} ${label.toLowerCase()}...`}
              value=""
              color={colorScheme === 'light' ? '#6b7280' : '#9ca3af'}
            />
            {items.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
                color={colorScheme === 'light' ? '#1f2937' : '#e5e7eb'}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <Text className={`${inputBg} rounded-xl p-3 text-sm ${secondaryText} ${valueClassName}`}>
          {value}
        </Text>
      )}
    </View>
  );
}