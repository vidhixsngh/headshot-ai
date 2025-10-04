import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import './PhotoUpload.css';

interface PhotoUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  error: string | null;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isUploading,
  error
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading
  });

  const handleRemoveFile = () => {
    setPreview(null);
    onFileRemove();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="photo-upload-container">
      <h2>Upload Your Photo</h2>
      <p className="upload-description">
        Upload a clear photo of yourself. We'll transform it into a professional headshot.
      </p>

      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`upload-dropzone ${isDragActive ? 'active' : ''} ${isUploading ? 'disabled' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <div className="upload-text">
              {isDragActive ? (
                <p>Drop your photo here...</p>
              ) : (
                <>
                  <p>Drag & drop your photo here, or <span className="click-text">click to browse</span></p>
                  <p className="upload-hint">
                    Supports JPEG, PNG, WebP • Max 10MB • Min 512x512px
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="file-preview">
          <div className="preview-image">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <div className="preview-placeholder">
                <ImageIcon size={48} />
                <p>Preview not available</p>
              </div>
            )}
          </div>
          <div className="file-info">
            <h3>{selectedFile.name}</h3>
            <p>{formatFileSize(selectedFile.size)}</p>
            <button
              onClick={handleRemoveFile}
              className="remove-button"
              disabled={isUploading}
            >
              <X size={16} />
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      {isUploading && (
        <div className="uploading-indicator">
          <div className="spinner"></div>
          <p>Uploading your photo...</p>
        </div>
      )}
    </div>
  );
};
