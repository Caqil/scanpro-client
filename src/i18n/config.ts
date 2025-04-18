// src/i18n/config.ts
export const SUPPORTED_LANGUAGES = [
    'en', // English
    'es', // Spanish
    'fr', // French
    'de', // German
    'it', // Italian
    'pt', // Portuguese
    'zh', // Chinese
    'ja', // Japanese
    'ko', // Korean
    'ru', // Russian
    'ar', // Arabic
    'hi', // Hindi
    'tr', // Turkish
    'id', // Indonesian
  ] as const;
  
  export type Language = typeof SUPPORTED_LANGUAGES[number];
  
  export const DEFAULT_LANGUAGE: Language = 'en';
  
  export const getLanguageName = (locale: Language): string => {
    const names: Record<Language, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      zh: '中文',
      ja: '日本語',
      ko: '한국어',
      ru: 'Русский',
      ar: 'العربية',
      hi: 'हिन्दी',
      tr: 'Türkçe',
      id: 'Bahasa Indonesia',
    };
    
    return names[locale] || locale;
  };