
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
  color: ${theme.colors.neutral.lightGray};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

export const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${theme.colors.neutral.mediumGray};
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.$error && `
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

export const Select = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  cursor: pointer;
  transition: all 0.3s ease;
  
  option {
    background: ${theme.colors.primary.dark};
    color: ${theme.colors.neutral.white};
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
  
  ${props => props.$error && `
    border-color: #ef4444;
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
    color: ${theme.colors.neutral.mediumGray};
    pointer-events: none;
  }
  
  input {
    padding-left: ${theme.spacing.xl};
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${theme.typography.sizes.small};
  color: #ef4444;
  margin-top: ${theme.spacing.xs};
`;

export const TextArea = styled.textarea`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  font-family: ${theme.typography.fontFamily};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  
  &::placeholder {
    color: ${theme.colors.neutral.mediumGray};
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(168, 85, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
  }
  
  ${props => props.$error && `
    border-color: #ef4444;
  `}
`;
