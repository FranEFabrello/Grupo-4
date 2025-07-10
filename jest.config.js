// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|unimodules|@unimodules/.*|native-base|react-native-svg|react-native-css-interop))',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^expo/.*': '<rootDir>/__mocks__/expo-winter.js',
  },
  collectCoverage: true, // Habilitar recolección de cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // Archivos a incluir en el reporte
    '!src/__tests__/**/*', // Excluir pruebas
    '!src/**/traslations.json', // Excluir archivos de traducción
  ],
  coverageDirectory: '<rootDir>/coverage', // Carpeta para reportes
  coverageReporters: ['text', 'html'], // Formatos de reporte
};