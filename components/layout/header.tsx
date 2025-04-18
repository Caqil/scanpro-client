"use client";

import { useState, useEffect } from "react";
import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/common/language-link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  UserIcon,
  LogInIcon,
  FileIcon,
} from "lucide-react";

import {
  SUPPORTED_LANGUAGES,
  getLanguageName,
} from "@/src/i18n/config";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

// Feature groups with icons and routes
const featureGroups = [
  {
    name: "Convert",
    features: [
      { name: "Convert", href: "/convert", icon: "FileTextIcon" },
      { name: "Compress", href: "/compress", icon: "FileIcon" },
      { name: "OCR", href: "/ocr", icon: "ScanIcon" },
    ],
  },
  {
    name: "Edit",
    features: [
      { name: "Edit", href: "/edit", icon: "PencilIcon" },
      { name: "Rotate", href: "/rotate", icon: "RotateCwIcon" },
      { name: "Watermark", href: "/watermark", icon: "WatermarkIcon" },
      { name: "Page Numbers", href: "/page-number", icon: "HashIcon" },
      { name: "Repair", href: "/repair", icon: "WrenchIcon" },
    ],
  },
  {
    name: "Organize",
    features: [
      { name: "Merge", href: "/merge", icon: "FileIcon" },
      { name: "Split", href: "/split", icon: "ScissorsIcon" },
    ],
  },
  {
    name: "Security",
    features: [
      { name: "Protect", href: "/protect", icon: "LockIcon" },
      { name: "Unlock", href: "/unlock", icon: "UnlockIcon" },
      { name: "Sign", href: "/sign", icon: "FileSignatureIcon" },
      { name: "Redact", href: "/redact", icon: "EraserIcon" },
    ],
  },
];

export function Header() {
  const { t, language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to change header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur transition-shadow",
        isScrolled ? "bg-background/95 shadow-sm" : "bg-background"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <LanguageLink href="/" className="flex items-center gap-2">
            <span className="text-primary">
              <FileIcon className="h-6 w-6" />
            </span>
            <span className="font-bold text-xl hidden sm:inline-block">
              {t("common.appName")}
            </span>
          </LanguageLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <LanguageLink
              href="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("header.dashboard")}
            </LanguageLink>

            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 gap-1">
                  {t("header.features")}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {featureGroups.map((group) => (
                  <div key={group.name}>
                    <DropdownMenuLabel>{group.name}</DropdownMenuLabel>
                    {group.features.map((feature) => (
                      <DropdownMenuItem key={feature.href} asChild>
                        <LanguageLink
                          href={feature.href}
                          className="flex items-center gap-2"
                        >
                          <span>{feature.name}</span>
                        </LanguageLink>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Right side: Language selector, Theme toggle, and User menu */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <GlobeIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t("common.languageSwitch")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUPPORTED_LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "cursor-pointer",
                    lang === language && "bg-primary/10"
                  )}
                >
                  {getLanguageName(lang)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>

          {/* User menu - would be replaced with authentication later */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <LanguageLink href="/login" className="flex items-center gap-2">
                  <LogInIcon className="h-4 w-4" />
                  <span>{t("header.login")}</span>
                </LanguageLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                  <LanguageLink
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">
                      {t("common.appName")}
                    </span>
                  </LanguageLink>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile navigation links */}
                <nav className="space-y-6">
                  <LanguageLink
                    href="/dashboard"
                    className="block text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("header.dashboard")}
                  </LanguageLink>

                  {/* Feature groups */}
                  {featureGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {group.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {group.features.map((feature) => (
                          <LanguageLink
                            key={feature.href}
                            href={feature.href}
                            className="block text-base hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {feature.name}
                          </LanguageLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
