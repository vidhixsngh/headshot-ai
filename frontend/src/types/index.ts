// Updated: 2024-10-04 16:30:00
export type HeadshotStyle = 'corporate' | 'creative' | 'executive';

export interface UploadResponse {
  success: boolean;
  message: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface GenerateRequest {
  fileId: string;
  style: HeadshotStyle;
}

export interface GenerateResponse {
  success: boolean;
  message: string;
  generatedImageId?: string;
  processingTime?: number;
}

export interface StatusResponse {
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  resultId?: string;
}

export interface DownloadResponse {
  success: boolean;
  imageUrl?: string;
  message: string;
}

export interface StyleInfo {
  id: HeadshotStyle;
  name: string;
  description: string;
  preview: string;
}

export interface AppState {
  uploadedFile: File | null;
  uploadedFileId: string | null;
  selectedStyle: HeadshotStyle | null;
  generatedImageId: string | null;
  processingStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage: string | null;
}
