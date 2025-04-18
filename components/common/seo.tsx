"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/src/store/store";

export function SEO({ structuredData }: { structuredData?: any }) {
  const pathname = usePathname();
  const { language } = useLanguageStore();

  // Google Analytics tracking
  useEffect(() => {
    // Only run in production and when the components have been hydrated
    if (process.env.NODE_ENV !== "production" || !pathname) return;

    // Track page views
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    };

    // Construct full URL
    handleRouteChange(pathname);
  }, [pathname, language]);

  return (
    <>
      {/* Structured Data */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Google Analytics - Only in production */}
      {process.env.NODE_ENV === "production" && (
        <>
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
          )}

          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          )}

          {process.env.NEXT_PUBLIC_GTM_ID && (
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `}
            </Script>
          )}
        </>
      )}
    </>
  );
}
