import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { UploadResponse } from '../types';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `upload-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Upload endpoint
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      } as UploadResponse);
    }

    const filePath = req.file.path;
    
    // Validate image dimensions using Sharp
    const metadata = await sharp(filePath).metadata();
    
    if (!metadata.width || !metadata.height) {
      fs.unlinkSync(filePath); // Clean up invalid file
      return res.status(400).json({
        success: false,
        message: 'Invalid image file'
      } as UploadResponse);
    }

    // Check dimensions
    const minDimension = 512;
    const maxDimension = 4096;
    
    if (metadata.width < minDimension || metadata.height < minDimension) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `Image too small. Minimum dimensions: ${minDimension}x${minDimension}px`
      } as UploadResponse);
    }

    if (metadata.width > maxDimension || metadata.height > maxDimension) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `Image too large. Maximum dimensions: ${maxDimension}x${maxDimension}px`
      } as UploadResponse);
    }

    const fileId = path.basename(filePath, path.extname(filePath));
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      }
    } as UploadResponse);

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Upload failed'
    } as UploadResponse);
  }
});

export { router as uploadRoutes };
