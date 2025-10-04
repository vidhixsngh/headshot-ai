import express from 'express';
import { GenerateRequest, GenerateResponse } from '../types';

const router = express.Router();

// Mock processing jobs storage
const processingJobs = new Map<string, {
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: number;
  style: string;
  resultId?: string;
}>();

// Generate endpoint
router.post('/', async (req, res) => {
  try {
    const { fileId, style }: GenerateRequest = req.body;

    if (!fileId || !style) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fileId and style'
      } as GenerateResponse);
    }

    if (!['corporate', 'creative', 'executive'].includes(style)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid style. Must be corporate, creative, or executive'
      } as GenerateResponse);
    }

    // Create a mock processing job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    processingJobs.set(jobId, {
      status: 'processing',
      progress: 0,
      startTime,
      style
    });

    // Simulate processing with progress updates
    simulateProcessing(jobId, fileId, style);

    res.json({
      success: true,
      message: 'Processing started',
      generatedImageId: jobId
    } as GenerateResponse);

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({
      success: false,
      message: 'Generation failed'
    } as GenerateResponse);
  }
});

// Simulate processing with progress updates
function simulateProcessing(jobId: string, fileId: string, style: string) {
  const job = processingJobs.get(jobId);
  if (!job) return;

  const progressSteps = [10, 25, 50, 75, 90, 100];
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= progressSteps.length) {
      // Processing complete
      job.status = 'completed';
      job.progress = 100;
      job.resultId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      clearInterval(interval);
      return;
    }

    job.progress = progressSteps[currentStep];
    currentStep++;
  }, 2000); // Update every 2 seconds

  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    setTimeout(() => {
      job.status = 'failed';
      job.progress = 0;
      clearInterval(interval);
    }, 3000);
  }
}

// Get processing status
router.get('/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = processingJobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  res.json({
    success: true,
    status: job.status,
    progress: job.progress,
    message: getStatusMessage(job.status, job.progress),
    resultId: job.resultId
  });
});

function getStatusMessage(status: string, progress: number): string {
  switch (status) {
    case 'processing':
      if (progress < 25) return 'Analyzing your photo...';
      if (progress < 50) return 'Applying professional style...';
      if (progress < 75) return 'Enhancing details...';
      if (progress < 100) return 'Finalizing your headshot...';
      return 'Processing complete!';
    case 'completed':
      return 'Your professional headshot is ready!';
    case 'failed':
      return 'Processing failed. Please try again.';
    default:
      return 'Unknown status';
  }
}

export { router as generateRoutes };
