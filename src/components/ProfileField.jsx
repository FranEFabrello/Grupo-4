import React from 'react';
import { View, Text, Picker } from 'react-native';

export default function ProfileField({ label, type = 'text', value, onChange, items = [] }) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-800 mb-1">{label}</Text>
      {type === 'picker' ? (
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          className="bg-gray-100 rounded-lg p-3"
        >
          <Picker.Item label={`Seleccionar ${label.toLowerCase()}...`} value="" />
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      ) : (
        <Text className="bg-gray-100 rounded-lg p-3 text-sm text-gray-600">{value}</Text>
      )}
    </View>
  );
}