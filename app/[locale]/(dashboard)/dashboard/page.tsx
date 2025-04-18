"use client";

import { useState } from "react";
import { useLanguageStore } from "@/src/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureCard } from "@/components/common/feature-card";
import {
  FileIcon,
  FileTextIcon,
  ScissorsIcon,
  RotateCwIcon,
  LockIcon,
  UnlockIcon,
  FileSignatureIcon,
  ScanIcon,
  PencilIcon,
  EraserIcon,
  WrenchIcon,
  HashIcon,
  BarChart3Icon,
  ClockIcon,
  StarIcon,
  StampIcon,
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("all");

  // All available tools
  const tools = [
    {
      title: t("features.convert.title"),
      description: t("features.convert.description"),
      href: "/convert",
      icon: <FileTextIcon />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      category: "convert",
    },
    {
      title: t("features.compress.title"),
      description: t("features.compress.description"),
      href: "/compress",
      icon: <FileIcon />,
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      category: "convert",
    },
    {
      title: t("features.merge.title"),
      description: t("features.merge.description"),
      href: "/merge",
      icon: <FileIcon />,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      category: "organize",
    },
    {
      title: t("features.split.title"),
      description: t("features.split.description"),
      href: "/split",
      icon: <ScissorsIcon />,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      category: "organize",
    },
    {
      title: t("features.rotate.title"),
      description: t("features.rotate.description"),
      href: "/rotate",
      icon: <RotateCwIcon />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      category: "edit",
    },
    {
      title: t("features.watermark.title"),
      description: t("features.watermark.description"),
      href: "/watermark",
      icon: <StampIcon />,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500",
      category: "edit",
    },
    {
      title: t("features.protect.title"),
      description: t("features.protect.description"),
      href: "/protect",
      icon: <LockIcon />,
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      category: "security",
    },
    {
      title: t("features.unlock.title"),
      description: t("features.unlock.description"),
      href: "/unlock",
      icon: <UnlockIcon />,
      bgColor: "bg-pink-50",
      iconColor: "text-pink-500",
      category: "security",
    },
    {
      title: t("features.sign.title"),
      description: t("features.sign.description"),
      href: "/sign",
      icon: <FileSignatureIcon />,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500",
      category: "security",
    },
    {
      title: t("features.ocr.title"),
      description: t("features.ocr.description"),
      href: "/ocr",
      icon: <ScanIcon />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      category: "convert",
    },
    {
      title: t("features.edit.title"),
      description: t("features.edit.description"),
      href: "/edit",
      icon: <PencilIcon />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      category: "edit",
    },
    {
      title: t("features.redact.title"),
      description: t("features.redact.description"),
      href: "/redact",
      icon: <EraserIcon />,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      category: "security",
    },
    {
      title: t("features.repair.title"),
      description: t("features.repair.description"),
      href: "/repair",
      icon: <WrenchIcon />,
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      category: "edit",
    },
    {
      title: t("features.pageNumber.title"),
      description: t("features.pageNumber.description"),
      href: "/page-number",
      icon: <HashIcon />,
      bgColor: "bg-violet-50",
      iconColor: "text-violet-500",
      category: "edit",
    },
  ];

  // Filter tools based on active tab
  const filteredTools =
    activeTab === "all"
      ? tools
      : tools.filter((tool) => tool.category === activeTab);

  // Mock recent files data (would typically come from an API)
  const recentFiles = [];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">{t("dashboard.title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <ClockIcon className="inline-block w-4 h-4 mr-2" />
              {t("dashboard.recentFiles")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentFiles.length > 0 ? (
              <ul className="space-y-2">
                {/* Recent files would be displayed here */}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("dashboard.noRecentFiles")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <StarIcon className="inline-block w-4 h-4 mr-2" />
              {t("dashboard.favorites")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Add tools to your favorites for quick access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <BarChart3Icon className="inline-block w-4 h-4 mr-2" />
              {t("dashboard.statistics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Usage statistics will appear here
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="organize">Organize</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => (
                <FeatureCard
                  key={index}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                  icon={tool.icon}
                  bgColor={tool.bgColor}
                  iconColor={tool.iconColor}
                  className="tool-card"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
