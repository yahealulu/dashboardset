import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import LanguageDetector from 'i18next-browser-languagedetector';

import ar from "./assets/locales/ar/translation.json";
import en from "./assets/locales/en/translation.json";

const storedLang = localStorage.getItem("lang");

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    debug: false,
    detection: {
      order: ["localStorage", "cookie", "htmlTag"],
      caches: ["localStorage"],
    },
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
