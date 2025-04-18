"use client";

import { Progress } from "@/components/ui/progress";
import { UploadIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { ArrowUpIcon, ClockIcon, Loader2Icon } from "lucide-react";
import { useLanguageStore } from "@/src/store/store";
import { cn, formatFileSize } from "@/lib/utils";

interface UploadStats {
  bytesTransferred?: number;
  totalBytes?: number;
  speed?: number;
  estimatedTime?: number;
}

interface ProcessingStatusProps {
  isUploading?: boolean;
  isProcessing?: boolean;
  progress: number;
  processingProgress?: number;
  error?: string | null;
  label?: string;
  uploadStats?: UploadStats;
  className?: string;
}

export function ProcessingStatus({
  isUploading = false,
  isProcessing = false,
  progress,
  processingProgress,
  error,
  label,
  uploadStats,
  className,
}: ProcessingStatusProps) {
  const { t } = useLanguageStore();

  const displayProgress = isUploading
    ? progress
    : processingProgress || progress;

  // Format estimated time in seconds
  const formatTime = (seconds?: number) => {
    if (!seconds) return "";
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isUploading ? (
            <>
              <ArrowUpIcon className="h-4 w-4 text-blue-500 animate-pulse" />
              <span className="text-sm font-medium">
                {label || t("common.loading")}
              </span>
            </>
          ) : isProcessing ? (
            <>
              <Loader2Icon className="h-4 w-4 text-orange-500 animate-spin" />
              <span className="text-sm font-medium">
                {label || t("common.processing")}
              </span>
            </>
          ) : (
            <>
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                {label || t("common.success")}
              </span>
            </>
          )}
        </div>

        <span className="text-sm text-muted-foreground">
          {displayProgress}%
        </span>
      </div>

      <Progress value={displayProgress} className="h-2" />

      {isUploading && uploadStats && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <UploadIcon className="h-3 w-3" />
            <span>
              {uploadStats.bytesTransferred && uploadStats.totalBytes
                ? `${formatFileSize(
                    uploadStats.bytesTransferred
                  )} / ${formatFileSize(uploadStats.totalBytes)}`
                : ""}
            </span>
          </div>

          {uploadStats.speed && (
            <div className="flex items-center gap-1">
              <span>{formatFileSize(uploadStats.speed)}/s</span>
            </div>
          )}

          {uploadStats.estimatedTime !== undefined && (
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>{formatTime(uploadStats.estimatedTime)}</span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
