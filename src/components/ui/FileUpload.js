
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Upload, X } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from './Button';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const UploadButton = styled.label`
  padding: ${theme.spacing.md};
  background: ${theme.colors.neutral.surface};
  border: 2px dashed ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  min-height: 120px;
  
  &:hover {
    background: ${theme.colors.neutral.surfaceHover};
    border-color: ${theme.colors.accent.blue};
  }
  
  input {
    display: none;
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: ${theme.borderRadius.medium};
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${theme.spacing.xs};
  right: ${theme.spacing.xs};
  background: ${theme.colors.status.error};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.surface};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.status.errorDark};
    transform: scale(1.1);
  }
`;

export const FileUpload = ({ onFileSelect, preview, onRemove, label = "Selecionar arquivo" }) => {
  const inputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };
  
  return (
    <UploadContainer>
      {!preview ? (
        <UploadButton>
          <Upload size={32} />
          <span>{label}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadButton>
      ) : (
        <PreviewContainer>
          <img src={preview} alt="Preview" />
          {onRemove && (
            <RemoveButton onClick={onRemove} type="button">
              <X size={20} />
            </RemoveButton>
          )}
        </PreviewContainer>
      )}
    </UploadContainer>
  );
};
