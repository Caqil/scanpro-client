// lib/seo/schemas.ts
import { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/src/i18n/config';
import enTranslations from '@/src/i18n/locales/en';

type Language = typeof SUPPORTED_LANGUAGES[number];

// Helper function to get translations
function getTranslation(lang: string, key: string): string {
  const translations = enTranslations; // For now using only English
  
  const keys = key.split('.');
  let result = translations;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      // @ts-expect-error - We're accessing properties dynamically
      result = result[k];
    } else {
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

// Extract keywords from text
function extractKeywords(text: string): string[] {
  // Split text into words and clean it
  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(word => word.length > 2);
  
  // English stop words to filter out
  const stopWords = [
    "the", "a", "an", "and", "or", "to", "in", "with", "for", "is", "on", "at", "of", "by"
  ];
  
  // Filter out stop words
  const filteredWords = words.filter(word => !stopWords.includes(word));
  
  // Generate bigrams (two-word phrases)
  const bigrams: string[] = [];
  for (let i = 0; i < filteredWords.length - 1; i++) {
    bigrams.push(`${filteredWords[i]} ${filteredWords[i + 1]}`);
  }
  
  // Count frequency of bigrams
  const bigramCounts = bigrams.reduce((acc, bigram) => {
    acc[bigram] = (acc[bigram] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by frequency and take top 5
  return Object.keys(bigramCounts)
    .sort((a, b) => bigramCounts[b] - bigramCounts[a])
    .slice(0, 5);
}

// Generate SEO metadata with translation support and flexible canonical URL
export function generatePageSeoMetadata(
  lang: Language,
  options: {
    pageName: string;
    additionalOptions?: Partial<Metadata>;
  }
): Metadata {
  const { pageName, additionalOptions = {} } = options;

  // Get translations for title and description
  const titleKey = `features.${pageName}.title`;
  const descriptionKey = `features.${pageName}.description`;
  
  const title = getTranslation(lang, titleKey);
  const description = getTranslation(lang, descriptionKey);
  
  // Add app name to title
  const fullTitle = `${title} | ${getTranslation(lang, 'common.appName')}`;

  // Extract keywords
  const keywords = extractKeywords(`${title} ${description}`);

  // Construct base metadata
  const baseMetadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    
    openGraph: {
      title: fullTitle,
      description,
      url: `/${lang}/${pageName}`,
      siteName: "ScanPro Client",
      locale: lang,
      type: 'website',
    },
    alternates: {
      canonical: `/${lang}/${pageName}`,
      languages: Object.fromEntries(
        SUPPORTED_LANGUAGES.map(code => [
          code,
          `/${code}/${pageName}`
        ])
      ),
    }
  };

  // Merge with additional options
  return {
    ...baseMetadata,
    ...additionalOptions
  };
}

// Generate schema.org structured data
export function generateStructuredData(pageName: string, title: string, description: string) {
  // Web application schema for feature pages
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: description,
    applicationCategory: 'Productivity',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
  
  // Software app schema for feature pages
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: description,
    applicationCategory: 'Productivity',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
  
  return [webAppSchema, softwareAppSchema];
}