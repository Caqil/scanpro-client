// app/[locale]/(features)/compress/page.tsx
"use client";

import { CompressionHandler } from "@/components/features/compress/compression-handler";
import { useLanguageStore } from "@/src/store/store";

export default function CompressPage() {
  const { t } = useLanguageStore();

  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t("features.compress.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("features.compress.description")}
        </p>
      </div>

      <CompressionHandler />
    </div>
  );
}
