"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadIcon, FileIcon, Cross2Icon } from "@radix-ui/react-icons";
import { formatFileSize } from "@/lib/utils";
import { useLanguageStore } from "@/src/store/store";

interface FileDropperProps {
  onFileDrop: (file: File) => void;
  onFileRemove?: () => void;
  file?: File | null;
  disabled?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export function FileDropper({
  onFileDrop,
  onFileRemove,
  file,
  disabled = false,
  accept = {
    "application/pdf": [".pdf"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}: FileDropperProps) {
  const { t } = useLanguageStore();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.file.size > maxSize) {
          setError(t("common.maxSizeExceeded"));
        } else {
          setError(t("common.invalidFileType"));
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setError(null);
        onFileDrop(acceptedFiles[0]);
      }
    },
    [maxSize, onFileDrop, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/10"
            : file
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "pointer-events-none opacity-80"
        )}
      >
        <input {...getInputProps()} disabled={disabled} />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FileIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            {onFileRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
              >
                <Cross2Icon className="h-4 w-4 mr-1" /> {t("common.cancel")}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-lg font-medium">
              {isDragActive ? t("common.dropHere") : t("common.dragDrop")}
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("common.maxFileSize")}
            </p>
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
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-center text-muted-foreground">
        {t("common.fileSecurity")}
      </p>
    </div>
  );
}
