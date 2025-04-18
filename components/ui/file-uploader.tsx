"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileIcon, UploadIcon, XCircleIcon } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  file?: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  errorMessage?: string;
  className?: string;
}

export const FileUploader = ({
  onFileSelect,
  onFileRemove,
  accept = {
    "application/pdf": [".pdf"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  file,
  isUploading = false,
  uploadProgress = 0,
  errorMessage,
  className,
}: FileUploaderProps) => {
  const { t } = useLanguageStore();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        // Handle rejection
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled: isUploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  // Format file size to human-readable format
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
          dragActive
            ? "border-primary bg-primary/5"
            : file
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FileIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>

            {isUploading ? (
              <div className="w-full max-w-xs">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  {uploadProgress}% {t("common.uploading")}...
                </p>
              </div>
            ) : (
              onFileRemove && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove();
                  }}
                >
                  <XCircleIcon className="h-4 w-4 mr-2" /> {t("common.remove")}
                </Button>
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <UploadIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1">
                {dragActive ? t("common.dropHere") : t("common.dragDrop")}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("common.maxFileSize")}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
            >
              {t("common.browse")}
            </Button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      )}
      <p className="mt-2 text-xs text-center text-muted-foreground">
        {t("common.fileSecurity")}
      </p>
    </div>
  );
};
