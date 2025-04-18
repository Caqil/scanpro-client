"use client";

import { useState } from "react";
import { useLanguageStore } from "@/src/store/store";
import { FileDropper } from "@/components/common/file-dropper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProcessingStatus } from "@/components/common/processing-status";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DownloadIcon, FileMinusIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function CompressPage() {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [compressQuality, setCompressQuality] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [resultFileUrl, setResultFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize?: number;
    compressedSize?: number;
    savedPercent?: number;
  } | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFileUrl(null);
    setError(null);
    setCompressionStats(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setResultFileUrl(null);
    setError(null);
    setCompressionStats(null);
  };

  const handleCompression = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProcessProgress(0);
    setError(null);

    try {
      const progressCallback = (progress: number) => {
        setProcessProgress(progress);
      };

      const result = await apiClient.compressFile(
        file,
        compressQuality,
        progressCallback
      );

      if (result.success && result.data) {
        setResultFileUrl(result.data.fileUrl);
        setCompressionStats({
          originalSize: file.size,
          compressedSize: result.data.compressedSize,
          savedPercent: Math.round(
            ((file.size - result.data.compressedSize) / file.size) * 100
          ),
        });
      } else {
        setError(result.error || t("errors.compressionFailed"));
      }
    } catch (err) {
      setError(t("errors.compressionFailed"));
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessProgress(100);
    }
  };

  const handleDownload = async () => {
    if (!resultFileUrl) return;

    const fileName =
      file?.name.replace(".pdf", "-compressed.pdf") || "compressed.pdf";
    await apiClient.downloadFile(resultFileUrl, fileName);
  };

  // Helper to format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {t("features.compress.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("features.compress.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("features.compress.uploadDescription")}</CardTitle>
              <CardDescription>{t("common.maxFileSize")}</CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropper
                file={file}
                onFileDrop={handleFileSelect}
                onFileRemove={handleFileRemove}
                accept={{
                  "application/pdf": [".pdf"],
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("features.compress.quality")}</CardTitle>
              <CardDescription>Select the compression quality</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={compressQuality}
                onValueChange={(value) =>
                  setCompressQuality(value as "low" | "medium" | "high")
                }
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="high" id="quality-high" />
                  <Label htmlFor="quality-high">
                    {t("features.compress.highQuality")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="medium" id="quality-medium" />
                  <Label htmlFor="quality-medium">
                    {t("features.compress.mediumQuality")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="quality-low" />
                  <Label htmlFor="quality-low">
                    {t("features.compress.lowQuality")}
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!file || isProcessing}
                onClick={handleCompression}
              >
                <FileMinusIcon className="mr-2 h-4 w-4" />
                {t("features.compress.compressNow")}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {isProcessing && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("common.processing")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingStatus
                isProcessing={true}
                progress={processProgress}
              />
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mt-8 border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {resultFileUrl && compressionStats && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("features.compress.success")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/40 p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("features.compress.originalSize")}
                  </p>
                  <p className="text-xl font-semibold">
                    {formatFileSize(compressionStats.originalSize)}
                  </p>
                </div>
                <div className="bg-muted/40 p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("features.compress.compressedSize")}
                  </p>
                  <p className="text-xl font-semibold">
                    {formatFileSize(compressionStats.compressedSize)}
                  </p>
                </div>
                <div className="bg-muted/40 p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("features.compress.savedSpace")}
                  </p>
                  <p className="text-xl font-semibold">
                    {formatFileSize(
                      (compressionStats.originalSize || 0) -
                        (compressionStats.compressedSize || 0)
                    )}
                  </p>
                </div>
                <div className="bg-muted/40 p-4 rounded-md text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("features.compress.compressionRatio")}
                  </p>
                  <p className="text-xl font-semibold">
                    {compressionStats.savedPercent}%
                  </p>
                </div>
              </div>
              <Button className="w-full" onClick={handleDownload}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                {t("common.downloadFile")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
