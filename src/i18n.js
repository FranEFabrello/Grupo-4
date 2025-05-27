import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './traslations/en/traslation.json';
import es from './traslations/es/traslation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
