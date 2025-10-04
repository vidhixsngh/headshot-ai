// Define the type first
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
