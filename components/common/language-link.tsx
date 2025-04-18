'use client';

import Link from 'next/link';
import { useLanguageStore } from '@/src/store/store';
import { ComponentProps } from 'react';

type LanguageLinkProps = Omit<ComponentProps<typeof Link>, 'locale'>;

export function LanguageLink({ href, ...props }: LanguageLinkProps) {
  const { language } = useLanguageStore();
  
  // Prepend current language to the href if it doesn't start with a language code
  let localizedHref = href.toString();
  if (!localizedHref.match(/^\/[a-z]{2}(\/|$)/)) {
    localizedHref = `/${language}${localizedHref.startsWith('/') ? '' : '/'}${localizedHref}`;
  }
  
  return <Link href={localizedHref} {...props} />;
}