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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProcessingStatus } from "@/components/common/processing-status";
import { FileTextIcon, DownloadIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { SUPPORTED_CONVERSION_INPUTS, SUPPORTED_CONVERSION_OUTPUTS } from "@/lib/validations/file-validations";
import { getFileExtension } from "@/lib/utils";

export default function ConvertPage() {
  const { t } = useLanguageStore();
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [performOcr, setPerformOcr] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [resultFileUrl, setResultFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResultFileUrl(null);
    setError(null);
    
    // Determine appropriate default output format based on input
    const extension = getFileExtension(selectedFile.name);
    if (extension === 'pdf') {
      setOutputFormat('docx');
    } else {
      setOutputFormat('pdf');
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setResultFileUrl(null);
    setError(null);
  };

  const handleConversion = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProcessProgress(0);
    setError(null);

    try {
      const progressCallback = (progress: number) => {
        setProcessProgress(progress);
      };

      const inputFormat = getFileExtension(file.name);
      
      const result = await apiClient.convertFile(
        file, 
        inputFormat, 
        outputFormat, 
        { ocr: performOcr },
        progressCallback
      );

      if (result.success && result.data) {
        setResultFileUrl(result.data.fileUrl);
      } else {
        setError(result.error || t("errors.conversionFailed"));
      }
    } catch (err) {
      setError(t("errors.conversionFailed"));
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProcessProgress(100);
    }
  };

  const handleDownload = async () => {
    if (!resultFileUrl || !file) return;
    
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const fileName = `${originalName}.${outputFormat}`;
    await apiClient.downloadFile(resultFileUrl, fileName);
  };

  // Get valid output formats based on input file
  const getValidOutputFormats = () => {
    if (!file) return SUPPORTED_CONVERSION_OUTPUTS;
    
    const extension = getFileExtension(file.name);
    
    if (extension === 'pdf') {
      return SUPPORTED_CONVERSION_OUTPUTS.filter(format => format !== 'pdf');
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return ['pdf', 'jpg', 'jpeg', 'png'];
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return ['pdf', 'docx', 'txt', 'rtf'];
    } else if (['xls', 'xlsx'].includes(extension)) {
      return ['pdf', 'xlsx'];
    } else if (['ppt', 'pptx'].includes(extension)) {
      return ['pdf', 'pptx'];
    }
    
    return SUPPORTED_CONVERSION_OUTPUTS;
  };

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">{t("features.convert.title")}</h1>
          <p className="text-muted-foreground">{t("features.convert.description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t("features.convert.uploadDescription")}</CardTitle>
              <CardDescription>
                {t("common.maxFileSize")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDropper
                file={file}
                onFileDrop={handleFileSelect}
                onFileRemove={handleFileRemove}
                accept={SUPPORTED_CONVERSION_INPUTS.reduce((acc, ext) => {
                  if (ext === 'pdf') {
                    acc['application/pdf'] = ['.pdf'];
                  } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                    acc['image/*'] = [`.${ext}`];
                  } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'txt'].includes(ext)) {
                    acc['application/*'] = [`.${ext}`];
                  }
                  return acc;
                }, {} as Record<string, string[]>)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("features.convert.outputFormat")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="output-format">{t("features.convert.outputFormat")}</Label>
                <Select 
                  value={outputFormat} 
                  onValueChange={setOutputFormat}
                  disabled={!file}
                >
                  <SelectTrigger id="output-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {getValidOutputFormats().map((format) => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show OCR option only for PDF output and image inputs */}
              {outputFormat === 'pdf' && file && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExtension(file.name)) && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ocr" 
                    checked={performOcr} 
                    onCheckedChange={(checked) => setPerformOcr(checked as boolean)}
                  />
                  <Label htmlFor="ocr">Perform OCR (extract text)</Label>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!file || !outputFormat || isProcessing} 
                onClick={handleConversion}
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                {t("features.convert.convertNow")}
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

        {resultFileUrl && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t("features.convert.success")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Your file has been successfully converted to {outputFormat.toUpperCase()}.</p>
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