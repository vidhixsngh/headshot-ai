import axios from 'axios';
import type { UploadResponse, GenerateRequest, GenerateResponse, StatusResponse, DownloadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Upload photo
export const uploadPhoto = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Generate headshot
export const generateHeadshot = async (request: GenerateRequest): Promise<GenerateResponse> => {
  const response = await api.post('/generate', request);
  return response.data;
};

// Check processing status
export const checkStatus = async (jobId: string): Promise<StatusResponse> => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
};

// Download generated image
export const downloadImage = async (resultId: string): Promise<DownloadResponse> => {
  const response = await api.get(`/download/${resultId}`);
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};
