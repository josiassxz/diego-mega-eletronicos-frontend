
import React, { useRef } from 'react';
import styled from 'styled-components';
import { Upload, X, Download, FileText, Image } from 'lucide-react';
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

const FileContainer = styled.div`
  position: relative;
  padding: ${theme.spacing.md};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-height: 80px;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.medium};
  background: ${props => props.isPdf ? theme.colors.accent.red + '20' : theme.colors.accent.blue + '20'};
  color: ${props => props.isPdf ? theme.colors.accent.red : theme.colors.accent.blue};
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  color: ${theme.colors.neutral.text};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};
  word-break: break-word;
  margin-bottom: ${theme.spacing.xs};
`;

const FileType = styled.div`
  color: ${theme.colors.neutral.textSecondary};
  font-size: ${theme.typography.sizes.small};
  text-transform: uppercase;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  background: ${theme.colors.neutral.surfaceHover};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.small};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.neutral.border};
    transform: scale(1.05);
  }
  
  &.download {
    color: ${theme.colors.accent.blue};
    
    &:hover {
      background: ${theme.colors.accent.blue + '20'};
    }
  }
  
  &.remove {
    color: ${theme.colors.status.error};
    
    &:hover {
      background: ${theme.colors.status.error + '20'};
    }
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

export const FileUpload = ({ 
  onFileSelect, 
  preview, 
  onRemove, 
  label = "Selecionar arquivo", 
  accept = "image/*",
  fileName,
  existingPhotoBase64,
  photoFileName,
  disabled = false
}) => {
  const inputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDownload = () => {
    if (existingPhotoBase64) {
      // Determinar o tipo de arquivo baseado no nome ou conteúdo
      const isPdf = photoFileName?.toLowerCase().includes('.pdf') || fileName?.toLowerCase().includes('.pdf');
      const mimeType = isPdf ? 'application/pdf' : 'image/jpeg';
      
      // Criar blob e fazer download
      const byteCharacters = atob(existingPhotoBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photoFileName || fileName || `arquivo.${isPdf ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  // Determinar tipo de arquivo
  const isPdf = fileName?.toLowerCase().includes('.pdf') || photoFileName?.toLowerCase().includes('.pdf');
  const isImage = !isPdf && (existingPhotoBase64 || preview);
  
  // Determina se deve mostrar preview de imagem, arquivo PDF ou nome do arquivo
  const showImagePreview = isImage && (preview || existingPhotoBase64);
  const showFileInfo = (fileName || existingPhotoBase64) && !showImagePreview;
  
  return (
    <UploadContainer>
      {!showImagePreview && !showFileInfo ? (
        <UploadButton style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <Upload size={32} />
          <span>{label}</span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </UploadButton>
      ) : showImagePreview ? (
        <PreviewContainer>
          <img src={preview || `data:image/jpeg;base64,${existingPhotoBase64}`} alt="Preview" />
          <ActionButtons style={{ position: 'absolute', top: theme.spacing.xs, right: theme.spacing.xs, flexDirection: 'column' }}>
            {existingPhotoBase64 && (
              <ActionButton className="download" onClick={handleDownload} type="button" title="Baixar arquivo">
                <Download size={16} />
              </ActionButton>
            )}
            {onRemove && !disabled && (
              <ActionButton className="remove" onClick={onRemove} type="button" title="Remover arquivo">
                <X size={16} />
              </ActionButton>
            )}
          </ActionButtons>
        </PreviewContainer>
      ) : (
        <FileContainer>
          <FileIcon isPdf={isPdf}>
            {isPdf ? <FileText size={24} /> : <Image size={24} />}
          </FileIcon>
          <FileInfo>
            <FileName>{fileName || photoFileName || 'Arquivo'}</FileName>
            <FileType>{isPdf ? 'PDF' : 'Imagem'}</FileType>
          </FileInfo>
          <ActionButtons>
            {existingPhotoBase64 && (
              <ActionButton className="download" onClick={handleDownload} type="button" title="Baixar arquivo">
                <Download size={16} />
              </ActionButton>
            )}
            {onRemove && !disabled && (
              <ActionButton className="remove" onClick={onRemove} type="button" title="Remover arquivo">
                <X size={16} />
              </ActionButton>
            )}
          </ActionButtons>
        </FileContainer>
      )}
    </UploadContainer>
  );
};
