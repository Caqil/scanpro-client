// lib/api-types.ts

// Base API response interface
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  // Compression feature response types
  export interface CompressionResponse {
    fileUrl: string;
    compressedSize: number;
    // Add any other properties returned by the compression API
  }
  
  // Conversion feature response types
  export interface ConversionResponse {
    fileUrl: string;
    // Add any other properties returned by the conversion API
  }
  
  // Merge feature response types
  export interface MergeResponse {
    fileUrl: string;
    // Add any other properties returned by the merge API
  }
  
  // Split feature response types
  export interface SplitResponse {
    fileUrl: string;
    files?: string[]; // For multiple files result
    // Add any other properties returned by the split API
  }
  
  // Watermark feature response types
  export interface WatermarkResponse {
    fileUrl: string;
    // Add any other properties returned by the watermark API
  }
  
  // Protect feature response types
  export interface ProtectResponse {
    fileUrl: string;
    // Add any other properties returned by the protect API
  }
  
  // Unlock feature response types
  export interface UnlockResponse {
    fileUrl: string;
    // Add any other properties returned by the unlock API
  }
  
  // OCR feature response types
  export interface OcrResponse {
    fileUrl: string;
    text?: string; // For text extraction
    // Add any other properties returned by the OCR API
  }
  
  // Common file upload stats
  export interface UploadStats {
    bytesTransferred?: number;
    totalBytes?: number;
    speed?: number;
    estimatedTime?: number;
  }