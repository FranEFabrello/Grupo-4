import React from 'react';
import { View, Text, Picker } from 'react-native';

export default function ProfileField({ label, type = 'text', value, onChange, items = [], disabled }) {
  // Detectar modo oscuro
  const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <View className="mb-4">
      <Text className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{label}</Text>
      {type === 'picker' ? (
        <View className={`rounded-lg border ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'} px-2 py-1 ${disabled ? 'opacity-60' : ''}`}>
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            enabled={!disabled}
            style={{ color: isDark ? '#e5e7eb' : '#1e293b', fontSize: 16, backgroundColor: isDark ? '#1f2937' : 'transparent' }}
            dropdownIconColor={isDark ? '#60a5fa' : '#2563eb'}
          >
            <Picker.Item label={`Seleccionar ${label.toLowerCase()}...`} value="" color={isDark ? '#9ca3af' : '#6b7280'} />
            {items.map((item) => (
              <Picker.Item key={item.value} label={item.label} value={item.value} color={isDark ? '#e5e7eb' : '#1e293b'} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text className={`rounded-lg p-3 text-sm ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>{value}</Text>
      )}
    </View>
  );
}

