import React from 'react';
import { Briefcase, Palette, Crown } from 'lucide-react';
import type { HeadshotStyle, StyleInfo } from '../../types/index';
import './StyleSelector.css';

interface StyleSelectorProps {
  selectedStyle: HeadshotStyle | null;
  onStyleSelect: (style: HeadshotStyle) => void;
  disabled?: boolean;
}

const styles: StyleInfo[] = [
  {
    id: 'corporate',
    name: 'Corporate Classic',
    description: 'Traditional business attire with neutral background and formal lighting. Perfect for LinkedIn profiles and corporate websites.',
    preview: '👔'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Modern business casual with subtle creative elements and professional lighting. Ideal for creative professionals and modern companies.',
    preview: '🎨'
  },
  {
    id: 'executive',
    name: 'Executive Portrait',
    description: 'Premium executive look with sophisticated background and high-end lighting. Perfect for C-level executives and high-profile professionals.',
    preview: '👑'
  }
];

const styleIcons = {
  corporate: Briefcase,
  creative: Palette,
  executive: Crown
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  disabled = false
}) => {
  return (
    <div className="style-selector-container">
      <h2>Choose Your Style</h2>
      <p className="style-description">
        Select the professional style that best fits your needs
      </p>

      <div className="styles-grid">
        {styles.map((style) => {
          const IconComponent = styleIcons[style.id];
          const isSelected = selectedStyle === style.id;
          
          return (
            <div
              key={style.id}
              className={`style-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => !disabled && onStyleSelect(style.id)}
            >
              <div className="style-header">
                <div className="style-icon">
                  <IconComponent size={32} />
                </div>
                <div className="style-preview">
                  <span className="preview-emoji">{style.preview}</span>
                </div>
              </div>
              
              <div className="style-content">
                <h3>{style.name}</h3>
                <p>{style.description}</p>
              </div>
              
              <div className="style-footer">
                <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                  {isSelected && <div className="checkmark">✓</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStyle && (
        <div className="selected-style-info">
          <p>
            <strong>Selected:</strong> {styles.find(s => s.id === selectedStyle)?.name}
          </p>
        </div>
      )}
    </div>
  );
};
