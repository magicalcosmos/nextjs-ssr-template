import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import exception from '../../public/locales/zh/exception.json';

i18next.use(initReactI18next).init({
  lng: 'zh',
  fallbackLng: 'zh',
  ns: ['exception'],
  defaultNS: 'exception',
  resources: {
    zh: {
      exception,
    },
  },
});

export default i18next;