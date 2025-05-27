import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import traducciones from './traslations/traslations.json';

// Función para extraer el idioma deseado de un JSON con estructura { key: { es: ..., en: ... } }
const transformarTraducciones = (json, idioma) => {
  const resultado = {};
  for (const key in json) {
    const value = json[key];

    if (typeof value === 'object' && value !== null && ('es' in value || 'en' in value)) {
      resultado[key] = value[idioma];
    } else if (typeof value === 'object' && value !== null) {
      resultado[key] = transformarTraducciones(value, idioma);
    } else {
      resultado[key] = value;
    }
  }
  return resultado;
};

const recursos = {
  es: {
    translation: transformarTraducciones(traducciones, 'es'),
  },
  en: {
    translation: transformarTraducciones(traducciones, 'en'),
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: recursos,
    lng: 'es', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
