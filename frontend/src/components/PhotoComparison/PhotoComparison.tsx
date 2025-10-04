import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './PhotoComparison.css';

interface PhotoComparisonProps {
  originalImage: string;
  generatedImage: string;
  originalFileName: string;
  onDownloadOriginal: () => void;
  onDownloadGenerated: () => void;
  onDownloadComparison: () => void;
}

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({
  originalImage,
  generatedImage,
  originalFileName,
  onDownloadOriginal,
  onDownloadGenerated,
  onDownloadComparison
}) => {
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(true);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const toggleView = () => {
    setShowOriginal(prev => !prev);
  };

  return (
    <div className="photo-comparison-container">
      <div className="comparison-header">
        <h2>Your Professional Headshot</h2>
        <p>Compare your original photo with the AI-generated professional headshot</p>
      </div>

      <div className="comparison-controls">
        <div className="zoom-controls">
          <button onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut size={16} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button onClick={handleZoomIn} disabled={zoom >= 3}>
            <ZoomIn size={16} />
          </button>
          <button onClick={handleResetZoom}>
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="view-controls">
          <button
            className={`view-button ${showOriginal ? 'active' : ''}`}
            onClick={() => setShowOriginal(true)}
          >
            Original
          </button>
          <button
            className={`view-button ${!showOriginal ? 'active' : ''}`}
            onClick={() => setShowOriginal(false)}
          >
            Generated
          </button>
          <button
            className="toggle-button"
            onClick={toggleView}
          >
            Toggle View
          </button>
        </div>
      </div>

      <div className="comparison-view">
        <div className="image-container" style={{ transform: `scale(${zoom})` }}>
          {showOriginal ? (
            <div className="image-wrapper">
              <img src={originalImage} alt="Original" />
              <div className="image-label">Original Photo</div>
            </div>
          ) : (
            <div className="image-wrapper">
              <img src={generatedImage} alt="Generated" />
              <div className="image-label">Professional Headshot</div>
            </div>
          )}
        </div>
      </div>

      <div className="download-controls">
        <h3>Download Options</h3>
        <div className="download-buttons">
          <button onClick={onDownloadOriginal} className="download-button">
            <Download size={16} />
            Download Original
          </button>
          <button onClick={onDownloadGenerated} className="download-button primary">
            <Download size={16} />
            Download Headshot
          </button>
          <button onClick={onDownloadComparison} className="download-button">
            <Download size={16} />
            Download Comparison
          </button>
        </div>
      </div>

      <div className="comparison-info">
        <div className="info-card">
          <h4>Original Photo</h4>
          <p>Your uploaded photo</p>
          <span className="file-name">{originalFileName}</span>
        </div>
        <div className="info-card">
          <h4>AI Generated</h4>
          <p>Professional headshot with selected style</p>
          <span className="file-name">professional-headshot.jpg</span>
        </div>
      </div>
    </div>
  );
};
