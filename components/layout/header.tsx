'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/src/store/store';
import { LanguageLink } from '@/components/common/language-link';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDownIcon, 
  HamburgerMenuIcon, 
  Cross1Icon,
  GlobeIcon
} from '@radix-ui/react-icons';
import { SUPPORTED_LANGUAGES, getLanguageName, Language } from '@/src/i18n/config';
import { cn } from '@/lib/utils';
import { 
  FileTextIcon, 
  FileIcon, 
  ScissorsIcon, 
  RotateCwIcon,
  WatermarkIcon,
  LockIcon,
  UnlockIcon,
  PencilIcon,
  ScanIcon, 
  HashIcon,
  FileSignatureIcon,
  EraserIcon,
  WrenchIcon,
  UserIcon
} from 'lucide-react';

// Feature list with icons and routes
const features = [
  { name: 'Convert', href: '/convert', icon: <FileTextIcon className="h-4 w-4" /> },
  { name: 'Compress', href: '/compress', icon: <FileIcon className="h-4 w-4" /> },
  { name: 'Merge', href: '/merge', icon: <FileIcon className="h-4 w-4" /> },
  { name: 'Split', href: '/split', icon: <ScissorsIcon className="h-4 w-4" /> },
  { name: 'Rotate', href: '/rotate', icon: <RotateCwIcon className="h-4 w-4" /> },
  { name: 'Watermark', href: '/watermark', icon: <WatermarkIcon className="h-4 w-4" /> },
  { name: 'Protect', href: '/protect', icon: <LockIcon className="h-4 w-4" /> },
  { name: 'Unlock', href: '/unlock', icon: <UnlockIcon className="h-4 w-4" /> },
  { name: 'Sign', href: '/sign', icon: <FileSignatureIcon className="h-4 w-4" /> },
  { name: 'OCR', href: '/ocr', icon: <ScanIcon className="h-4 w-4" /> },
  { name: 'Edit', href: '/edit', icon: <PencilIcon className="h-4 w-4" /> },
  { name: 'Redact', href: '/redact', icon: <EraserIcon className="h-4 w-4" /> },
  { name: 'Repair', href: '/repair', icon: <WrenchIcon className="h-4 w-4" /> },
  { name: 'Page Numbers', href: '/page-number', icon: <HashIcon className="h-4 w-4" /> },
];

export function Header() {
  const { t, language, setLanguage } = useLanguageStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <LanguageLink href="/" className="flex items-center gap-2">
            <FileIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">
              {t('common.appName')}
            </span>
          </LanguageLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <LanguageLink href="/dashboard" className="text-sm font-medium">
              {t('header.dashboard')}
            </LanguageLink>
            
            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 gap-1">
                  {t('header.features')}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 grid grid-cols-2 gap-1 p-2">
                {features.map((feature) => (
                  <DropdownMenuItem key={feature.href} asChild>
                    <LanguageLink href={feature.href} className="flex items-center gap-2">
                      {feature.icon}
                      <span>{feature.name}</span>
                    </LanguageLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right side: Language selector and User menu */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost