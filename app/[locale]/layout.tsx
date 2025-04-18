"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguageStore } from "@/src/store/store";
import { useEffect } from "react";
import { SEO } from "@/components/common/seo";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { setLanguage } = useLanguageStore();

  // Set language based on URL
  useEffect(() => {
    if (params.locale) {
      setLanguage(params.locale as any);
    }
  }, [params.locale, setLanguage]);

  return (
    <TooltipProvider>
      <SEO />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
