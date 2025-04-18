// lib/api-client.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Define the API error interface
export interface ApiError {
  error: string;
  success: boolean;
  status?: number;
}

// Define the API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://scanpro.cc/api',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-api-key': this.apiKey,
      },
    });

    // Response interceptor to standardize error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          error: error.response?.data?.error || 'Unknown error occurred',
          success: false,
          status: error.response?.status,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Generic method to handle file uploads with progress tracking
  async uploadFile<T>(
    endpoint: string, 
    formData: FormData, 
    options?: {
      onProgress?: (progress: number) => void;
      config?: AxiosRequestConfig;
    }
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        ...options?.config,
      };

      if (options?.onProgress) {
        config.onUploadProgress = (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            options.onProgress?.(progress);
          }
        };
      }

      const response = await this.client.post<T>(endpoint, formData, config);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.error || 'Something went wrong',
      };
    }
  }

  // Method to handle file downloads
  async downloadFile(fileUrl: string, filename: string): Promise<boolean> {
    try {
      const response = await this.client.get(fileUrl, {
        responseType: 'blob',
      });

      // Create a link element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      return false;
    }
  }

  // API functions for specific features
  async convertFile(
    file: File, 
    inputFormat: string, 
    outputFormat: string, 
    options?: { ocr?: boolean; quality?: number; password?: string },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('inputFormat', inputFormat);
    formData.append('outputFormat', outputFormat);
    
    if (options?.ocr !== undefined) {
      formData.append('ocr', options.ocr.toString());
    }
    
    if (options?.quality !== undefined) {
      formData.append('quality', options.quality.toString());
    }
    
    if (options?.password) {
      formData.append('password', options.password);
    }

    return this.uploadFile('/convert', formData, { onProgress });
  }

  async compressFile(
    file: File,
    quality: 'low' | 'medium' | 'high',
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);

    return this.uploadFile('/compress', formData, { onProgress });
  }

  async mergeFiles(
    files: File[],
    order?: number[],
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    if (order && order.length === files.length) {
      formData.append('order', JSON.stringify(order));
    }

    return this.uploadFile('/merge', formData, { onProgress });
  }

  async splitFile(
    file: File,
    splitMethod: 'range' | 'extract' | 'every',
    options?: { pageRanges?: string; everyNPages?: number },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('splitMethod', splitMethod);
    
    if (splitMethod === 'range' && options?.pageRanges) {
      formData.append('pageRanges', options.pageRanges);
    }
    
    if (splitMethod === 'every' && options?.everyNPages) {
      formData.append('everyNPages', options.everyNPages.toString());
    }

    return this.uploadFile('/pdf/split', formData, { onProgress });
  }

  async rotatePdf(
    file: File,
    angle: number,
    pages?: number[],
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('angle', angle.toString());
    
    if (pages && pages.length > 0) {
      formData.append('pages', JSON.stringify(pages));
    }

    return this.uploadFile('/rotate', formData, { onProgress });
  }

  async addWatermark(
    file: File,
    watermarkType: 'text' | 'image',
    options: {
      text?: string;
      watermarkImage?: File;
      position?: string;
      opacity?: number;
      rotation?: number;
      scale?: number;
      textColor?: string;
      fontSize?: number;
      fontFamily?: string;
      pages?: string;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('watermarkType', watermarkType);
    
    if (watermarkType === 'text' && options.text) {
      formData.append('text', options.text);
      
      if (options.textColor) formData.append('textColor', options.textColor);
      if (options.fontSize) formData.append('fontSize', options.fontSize.toString());
      if (options.fontFamily) formData.append('fontFamily', options.fontFamily);
    }
    
    if (watermarkType === 'image' && options.watermarkImage) {
      formData.append('watermarkImage', options.watermarkImage);
      if (options.scale) formData.append('scale', options.scale.toString());
    }
    
    if (options.position) formData.append('position', options.position);
    if (options.opacity) formData.append('opacity', options.opacity.toString());
    if (options.rotation) formData.append('rotation', options.rotation.toString());
    if (options.pages) formData.append('pages', options.pages);

    return this.uploadFile('/pdf/watermark', formData, { onProgress });
  }

  async protectPdf(
    file: File,
    password: string,
    permissions?: {
      allowPrinting?: boolean;
      allowCopying?: boolean;
      allowEditing?: boolean;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    
    if (permissions) {
      if (permissions.allowPrinting !== undefined) {
        formData.append('allowPrinting', permissions.allowPrinting.toString());
      }
      if (permissions.allowCopying !== undefined) {
        formData.append('allowCopying', permissions.allowCopying.toString());
      }
      if (permissions.allowEditing !== undefined) {
        formData.append('allowEditing', permissions.allowEditing.toString());
      }
    }

    return this.uploadFile('/pdf/protect', formData, { onProgress });
  }

  async unlockPdf(
    file: File,
    password?: string,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (password) {
      formData.append('password', password);
    }

    return this.uploadFile('/pdf/unlock', formData, { onProgress });
  }

  async signPdf(
    file: File,
    elements: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      data: string;
      rotation: number;
      scale: number;
      page: number;
      color?: string;
      fontSize?: number;
      fontFamily?: string;
    }>,
    pages: Array<{
      width: number;
      height: number;
      originalWidth: number;
      originalHeight: number;
    }>,
    performOcr?: boolean,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('elements', JSON.stringify(elements));
    formData.append('pages', JSON.stringify(pages));
    
    if (performOcr !== undefined) {
      formData.append('performOcr', performOcr.toString());
    }

    return this.uploadFile('/pdf/sign', formData, { onProgress });
  }

  async performOcr(
    file: File,
    language: string = 'eng',
    outputFormat: 'text' | 'searchablePdf' = 'searchablePdf',
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('outputFormat', outputFormat);

    return this.uploadFile('/pdf/ocr', formData, { onProgress });
  }

  async editPdf(
    file: File,
    edits: any[],
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('edits', JSON.stringify(edits));

    return this.uploadFile('/pdf/edit', formData, { onProgress });
  }

  async redactPdf(
    file: File,
    redactions: Array<{
      page: number;
      areas: Array<{ x: number; y: number; width: number; height: number }>;
    }>,
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('redactions', JSON.stringify(redactions));

    return this.uploadFile('/pdf/redact', formData, { onProgress });
  }

  async repairPdf(
    file: File,
    repairMode: 'standard' | 'advanced' = 'standard',
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('repairMode', repairMode);

    return this.uploadFile('/pdf/repair', formData, { onProgress });
  }

  async addPageNumbers(
    file: File,
    options: {
      format?: 'numeric' | 'roman' | 'alphabetic';
      position?: string;
      startNumber?: number;
      fontFamily?: string;
      fontSize?: number;
      color?: string;
      prefix?: string;
      suffix?: string;
      marginX?: number;
      marginY?: number;
      skipFirstPage?: boolean;
      selectedPages?: string;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    return this.uploadFile('/pdf/pagenumber', formData, { onProgress });
  }

  // Method to check split job status
  async checkSplitStatus(jobId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/pdf/split/status?id=${jobId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.error || 'Failed to check job status',
      };
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();

export default apiClient;