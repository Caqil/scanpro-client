"use client";

import { useLanguageStore } from "@/src/store/store";
import { Button } from "@/components/ui/button";
import { LanguageLink } from "@/components/common/language-link";
import { FeatureCard } from "@/components/common/feature-card";
import {
  FileIcon,
  FileTextIcon,
  LockIcon,
  FileSignatureIcon,
  ScanIcon,
  ShieldIcon,
} from "lucide-react";

export default function HomePage() {
  const { t } = useLanguageStore();

  // Featured tools
  const featuredTools = [
    {
      title: t("features.convert.title"),
      description: t("features.convert.description"),
      href: "/convert",
      icon: <FileTextIcon />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: t("features.compress.title"),
      description: t("features.compress.description"),
      href: "/compress",
      icon: <FileIcon />,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: t("features.merge.title"),
      description: t("features.merge.description"),
      href: "/merge",
      icon: <FileIcon />,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: t("features.ocr.title"),
      description: t("features.ocr.description"),
      href: "/ocr",
      icon: <ScanIcon />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: t("features.protect.title"),
      description: t("features.protect.description"),
      href: "/protect",
      icon: <LockIcon />,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: t("features.sign.title"),
      description: t("features.sign.description"),
      href: "/sign",
      icon: <FileSignatureIcon />,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="relative py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t("home.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              {t("home.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LanguageLink href="/convert">
                <Button size="lg">{t("home.getStarted")}</Button>
              </LanguageLink>
              <LanguageLink href="#features">
                <Button size="lg" variant="outline">
                  {t("home.exploreFeatures")}
                </Button>
              </LanguageLink>
            </div>
          </div>
        </div>
      </section>

      {/* Featured tools section */}
      <section id="features" className="py-16 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              {t("home.featuredTools")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Process your documents quickly and securely with our powerful
              online tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, index) => (
              <FeatureCard
                key={index}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                bgColor={tool.bgColor}
                iconColor={tool.iconColor}
                buttonText={t("common.getStarted")}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <LanguageLink href="/dashboard">
              <Button variant="outline" size="lg">
                {t("home.allTools")}
              </Button>
            </LanguageLink>
          </div>
        </div>
      </section>

      {/* Security section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <ShieldIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {t("home.secureProcessing")}
            </h2>
            <p className="text-muted-foreground">
              {t("home.securityDescription")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
