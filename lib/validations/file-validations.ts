// lib/validations/file-validations.ts
import { z } from 'zod';
import { getFileExtension } from '../utils';

// Maximum file size in bytes (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported formats
export const SUPPORTED_PDF_EXTENSIONS = ['pdf'];
export const SUPPORTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const SUPPORTED_DOCUMENT_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'txt', 'html'];
export const SUPPORTED_CONVERSION_INPUTS = [...SUPPORTED_PDF_EXTENSIONS, ...SUPPORTED_DOCUMENT_EXTENSIONS, ...SUPPORTED_IMAGE_EXTENSIONS];
export const SUPPORTED_CONVERSION_OUTPUTS = ['pdf', 'docx', 'xlsx', 'pptx', 'rtf', 'txt', 'html', 'jpg', 'jpeg', 'png'];

// Validation functions
export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

export function isValidPdfFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_PDF_EXTENSIONS.includes(extension);
}

export function isValidImageFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_IMAGE_EXTENSIONS.includes(extension);
}

export function isValidDocumentFile(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_DOCUMENT_EXTENSIONS.includes(extension);
}

export function isValidConversionInput(file: File): boolean {
  const extension = getFileExtension(file.name);
  return SUPPORTED_CONVERSION_INPUTS.includes(extension);
}

// Zod schemas for form validations
export const PdfFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed',
    }),
});

export const ImageFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidImageFile(file), {
      message: 'Only JPG, JPEG, PNG, GIF, and WebP files are allowed',
    }),
});

export const DocumentFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidDocumentFile(file), {
      message: 'Only document files (DOCX, XLSX, PPTX, etc.) are allowed',
    }),
});

export const ConversionInputSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidConversionInput(file), {
      message: 'Unsupported file type for conversion',
    }),
  outputFormat: z.enum(SUPPORTED_CONVERSION_OUTPUTS as [string, ...string[]]),
});

export const CompressFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for compression',
    }),
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const MergeFormSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .refine(files => files.length >= 2, {
      message: 'At least 2 files are required for merging',
    })
    .refine(
      files => files.every(file => isValidFileSize(file)),
      {
        message: `All files should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      }
    )
    .refine(
      files => files.every(file => isValidPdfFile(file)),
      {
        message: 'Only PDF files are allowed for merging',
      }
    ),
});

export const SplitFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for splitting',
    }),
  splitMethod: z.enum(['range', 'extract', 'every']).default('range'),
  pageRanges: z.string().optional(),
  everyNPages: z.number().min(1).default(1),
});

export const RotateFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for rotation',
    }),
  angle: z.number().int().default(90),
  pages: z.array(z.number().int().min(1)).optional(),
});

export const WatermarkFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for watermarking',
    }),
  watermarkType: z.enum(['text', 'image']).default('text'),
  text: z.string().optional(),
  position: z.string().default('center'),
  opacity: z.number().min(1).max(100).default(50),
  rotation: z.number().default(0),
  fontSize: z.number().min(8).max(72).default(24),
  color: z.string().default('#000000'),
  fontFamily: z.string().default('Arial'),
  pages: z.string().optional(),
});

export const ProtectFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for protection',
    }),
  password: z.string().min(1, { message: 'Password is required' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  allowPrinting: z.boolean().default(true),
  allowCopying: z.boolean().default(true),
  allowEditing: z.boolean().default(true),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const UnlockFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for unlocking',
    }),
  password: z.string().optional(),
});

export const PageNumberFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => isValidFileSize(file), {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(file => isValidPdfFile(file), {
      message: 'Only PDF files are allowed for adding page numbers',
    }),
  format: z.enum(['numeric', 'roman', 'alphabetic']).default('numeric'),
  position: z.string().default('bottom-center'),
  startNumber: z.number().min(1).default(1),
  fontFamily: z.string().default('Helvetica'),
  fontSize: z.number().min(8).max(72).default(12),
  color: z.string().default('#000000'),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  marginX: z.number().min(0).default(40),
  marginY: z.number().min(0).default(30),
  skipFirstPage: z.boolean().default(false),
  selectedPages: z.string().optional(),
});