import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Download endpoint
router.get('/:resultId', (req, res) => {
  const { resultId } = req.params;
  
  // For mock purposes, we'll return a placeholder image URL
  // In a real implementation, this would serve the actual generated image
  const mockImageUrl = `/api/mock-image/${resultId}`;
  
  res.json({
    success: true,
    imageUrl: mockImageUrl,
    message: 'Image ready for download'
  });
});

// Mock image endpoint (serves a placeholder)
router.get('/mock-image/:resultId', (req, res) => {
  const { resultId } = req.params;
  
  // Create a simple placeholder image using SVG
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f0f0f0"/>
      <text x="200" y="200" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
        Generated Headshot
      </text>
      <text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
        ${resultId}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

export { router as downloadRoutes };
