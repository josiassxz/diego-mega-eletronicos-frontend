
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${theme.typography.sizes.small};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.neutral.textSecondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.text};
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${theme.colors.neutral.textMuted};
  }
  
  &:focus {
    outline: none;
    background: ${theme.colors.neutral.surface};
    border-color: ${theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${theme.colors.accent.blueLight};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.$error && `
    border-color: ${theme.colors.status.error};
    
    &:focus {
      border-color: ${theme.colors.status.error};
      box-shadow: 0 0 0 3px ${theme.colors.status.errorLight};
    }
  `}
`;

export const Select = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  option {
    background: ${theme.colors.neutral.surface};
    color: ${theme.colors.neutral.text};
  }
  
  &:focus {
    outline: none;
    background: ${theme.colors.neutral.surface};
    border-color: ${theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${theme.colors.accent.blueLight};
  }
  
  ${props => props.$error && `
    border-color: ${theme.colors.status.error};
  `}
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  position: relative;
  
  svg {
    position: absolute;
    left: ${theme.spacing.sm};
    color: ${theme.colors.neutral.textMuted};
    pointer-events: none;
  }
  
  input {
    padding-left: ${theme.spacing.xl};
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.status.error};
  margin-top: ${theme.spacing.xs};
`;

export const TextArea = styled.textarea`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  font-family: ${theme.typography.fontFamily};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.text};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: ${theme.colors.neutral.textMuted};
  }

  &:focus {
    outline: none;
    background: ${theme.colors.neutral.surface};
    border-color: ${theme.colors.accent.blue};
    box-shadow: 0 0 0 3px ${theme.colors.accent.blueLight};
  }
  
  ${props => props.$error && `
    border-color: ${theme.colors.status.error};
  `}
`;
