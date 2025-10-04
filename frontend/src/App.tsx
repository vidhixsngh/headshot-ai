import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PhotoUpload } from './components/PhotoUpload/PhotoUpload';
import { StyleSelector } from './components/StyleSelector/StyleSelector';
import { PhotoComparison } from './components/PhotoComparison/PhotoComparison';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { uploadPhoto, generateHeadshot, checkStatus } from './services/api';
import type { AppState, HeadshotStyle } from './types';
import './App.css';

const initialState: AppState = {
  uploadedFile: null,
  uploadedFileId: null,
  selectedStyle: null,
  generatedImageId: null,
  processingStatus: 'idle',
  progress: 0,
  errorMessage: null
};

function MainApp() {
  const [state, setState] = useState<AppState>(initialState);
  const navigate = useNavigate();

  const handleFileSelect = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, processingStatus: 'uploading', errorMessage: null }));
    
    try {
      const response = await uploadPhoto(file);
      if (response.success && response.fileId) {
        setState(prev => ({
          ...prev,
          uploadedFile: file,
          uploadedFileId: response.fileId || null,
          processingStatus: 'idle'
        }));
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        processingStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Upload failed'
      }));
    }
  }, []);

  const handleFileRemove = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedFile: null,
      uploadedFileId: null,
      selectedStyle: null,
      generatedImageId: null,
      processingStatus: 'idle',
      progress: 0,
      errorMessage: null
    }));
  }, []);

  const handleStyleSelect = useCallback((style: HeadshotStyle) => {
    setState(prev => ({ ...prev, selectedStyle: style }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!state.uploadedFileId || !state.selectedStyle) return;

    setState(prev => ({ ...prev, processingStatus: 'processing', progress: 0 }));
    
    try {
      const response = await generateHeadshot({
        fileId: state.uploadedFileId,
        style: state.selectedStyle
      });

      if (response.success && response.generatedImageId) {
        setState(prev => ({ ...prev, generatedImageId: response.generatedImageId || null }));
        
        // Poll for status updates
        const pollStatus = async () => {
          try {
            const statusResponse = await checkStatus(response.generatedImageId!);
            setState(prev => ({ ...prev, progress: statusResponse.progress }));
            
            if (statusResponse.status === 'completed') {
              setState(prev => ({ ...prev, processingStatus: 'completed' }));
            } else if (statusResponse.status === 'failed') {
              setState(prev => ({ 
                ...prev, 
                processingStatus: 'error',
                errorMessage: 'Generation failed. Please try again.'
              }));
            } else {
              // Continue polling
              setTimeout(pollStatus, 2000);
            }
          } catch (error) {
            setState(prev => ({ 
              ...prev, 
              processingStatus: 'error',
              errorMessage: 'Status check failed'
            }));
          }
        };
        
        setTimeout(pollStatus, 1000);
      } else {
        throw new Error(response.message || 'Generation failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        processingStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Generation failed'
      }));
    }
  }, [state.uploadedFileId, state.selectedStyle]);

  const handleDownloadOriginal = useCallback(() => {
    if (state.uploadedFile) {
      const url = URL.createObjectURL(state.uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = state.uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [state.uploadedFile]);

  const handleDownloadGenerated = useCallback(() => {
    // Mock download - in real implementation, this would download the generated image
    const mockImageUrl = `http://localhost:3001/api/mock-image/${state.generatedImageId}`;
    const a = document.createElement('a');
    a.href = mockImageUrl;
    a.download = 'professional-headshot.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [state.generatedImageId]);

  const handleDownloadComparison = useCallback(() => {
    // Mock download - in real implementation, this would create a comparison collage
    alert('Comparison download feature coming soon!');
  }, []);

  const getStatusMessage = () => {
    if (state.processingStatus === 'uploading') return 'Uploading your photo...';
    if (state.processingStatus === 'processing') {
      if (state.progress < 25) return 'Analyzing your photo...';
      if (state.progress < 50) return 'Applying professional style...';
      if (state.progress < 75) return 'Enhancing details...';
      if (state.progress < 100) return 'Finalizing your headshot...';
      return 'Processing complete!';
    }
    return 'Processing...';
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Professional Headshot AI</h1>
        <p>Transform your photos into professional headshots with AI</p>
      </header>

      <main className="app-main">
        <Routes>
            <Route path="/" element={
              <div className="page-container">
                <PhotoUpload
                  onFileSelect={handleFileSelect}
                  onFileRemove={handleFileRemove}
                  selectedFile={state.uploadedFile}
                  isUploading={state.processingStatus === 'uploading'}
                  error={state.errorMessage}
                />
                
                {state.uploadedFile && state.processingStatus === 'idle' && (
                  <div className="next-step">
                    <button 
                      onClick={() => navigate('/process')}
                      className="next-button"
                    >
                      Choose Style →
                    </button>
                  </div>
                )}
              </div>
            } />

            <Route path="/process" element={
              state.uploadedFile ? (
                <div className="page-container">
                  <StyleSelector
                    selectedStyle={state.selectedStyle}
                    onStyleSelect={handleStyleSelect}
                    disabled={state.processingStatus === 'processing'}
                  />
                  
                  {state.selectedStyle && (
                    <div className="generate-section">
                      <button 
                        onClick={handleGenerate}
                        className="generate-button"
                        disabled={state.processingStatus === 'processing'}
                      >
                        Generate Professional Headshot
                      </button>
                    </div>
                  )}

                  {state.processingStatus === 'processing' && (
                    <div className="processing-section">
                      <LoadingSpinner
                        message={getStatusMessage()}
                        progress={state.progress}
                        size="large"
                      />
                    </div>
                  )}

                  {state.processingStatus === 'completed' && state.generatedImageId && (
                    <div className="completion-section">
                      <div className="success-message">
                        <h3>🎉 Your professional headshot is ready!</h3>
                        <button 
                          onClick={() => navigate('/result')}
                          className="view-result-button"
                        >
                          View Results →
                        </button>
                      </div>
                    </div>
                  )}

                  {state.errorMessage && (
                    <div className="error-section">
                      <div className="error-message">
                        <h3>❌ Error</h3>
                        <p>{state.errorMessage}</p>
                        <button 
                          onClick={() => setState(prev => ({ ...prev, errorMessage: null }))}
                          className="retry-button"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } />

            <Route path="/result" element={
              state.uploadedFile && state.generatedImageId ? (
                <PhotoComparison
                  originalImage={URL.createObjectURL(state.uploadedFile)}
                  generatedImage={`http://localhost:3001/api/mock-image/${state.generatedImageId}`}
                  originalFileName={state.uploadedFile.name}
                  onDownloadOriginal={handleDownloadOriginal}
                  onDownloadGenerated={handleDownloadGenerated}
                  onDownloadComparison={handleDownloadComparison}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 Professional Headshot AI. Built with React & Express.</p>
        </footer>
      </div>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;