import React from 'react';
import { View, Text, Picker } from 'react-native';
import { useColorScheme } from 'react-native';

export default function ProfileField({ label, type = 'text', value, onChange, items = [], disabled, colorScheme }) {
  const isDark = colorScheme === 'dark';

  return (
    <View className="mb-6 w-full">
      <Text className={`text-base font-semibold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{label}</Text>
      {type === 'picker' ? (
        <View className={`rounded-xl border ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-100'} px-4 py-3 ${disabled ? 'opacity-50' : ''} shadow-sm`}>
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            enabled={!disabled}
            style={{
              color: isDark ? '#ffffff' : '#1f2937',
              fontSize: 16,
              backgroundColor: isDark ? '#1f2937' : '#f9fafb',
            }}
            dropdownIconColor={isDark ? '#60a5fa' : '#2563eb'}
            itemStyle={{
              color: isDark ? '#ffffff' : '#1f2937',
              backgroundColor: isDark ? '#374151' : '#ffffff',
              fontSize: 16,
            }}
          >
            <Picker.Item label={`Seleccionar ${label.toLowerCase()}...`} value="" color={isDark ? '#9ca3af' : '#6b7280'} />
            {items.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} color={isDark ? '#ffffff' : '#1f2937'} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text className={`rounded-xl p-3 text-base ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'} shadow-sm`}>{value}</Text>
      )}
    </View>
  );
}