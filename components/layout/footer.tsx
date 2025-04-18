"use client";

import { useLanguageStore } from "@/src/store/store";
import { LanguageLink } from "@/components/common/language-link";

export function Footer() {
  const { t } = useLanguageStore();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="text-sm text-muted-foreground">
          {t("footer.copyright").replace("2025", currentYear.toString())}
        </div>
        <div className="flex items-center gap-6">
          <LanguageLink
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.termsOfService")}
          </LanguageLink>
          <LanguageLink
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.privacyPolicy")}
          </LanguageLink>
          <LanguageLink
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.contact")}
          </LanguageLink>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
