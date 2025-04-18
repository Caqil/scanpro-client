// src/store/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import enTranslations from '@/src/i18n/locales/en';
import { DEFAULT_LANGUAGE, Language, SUPPORTED_LANGUAGES } from '@/src/i18n/config';

interface LanguageState {
  language: Language;
  t: (key: string) => string;
  setLanguage: (language: Language) => void;
}

// Helper function to get a nested property from an object using a string path
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return path; // Return the key path if we can't traverse further
    }
    result = result[key];
  }
  
  return result !== undefined && result !== null ? result : path;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      t: (key: string) => {
        const translations = enTranslations; // For now using only English
        return getNestedValue(translations, key) || key;
      },
      setLanguage: (language: Language) => {
        if (SUPPORTED_LANGUAGES.includes(language)) {
          set({ language });
        }
      },
    }),
    {
      name: 'language-store',
    }
  )
);