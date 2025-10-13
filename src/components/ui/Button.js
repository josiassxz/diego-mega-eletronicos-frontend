
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const Button = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.semiBold};
  border-radius: ${theme.borderRadius.medium};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  
  ${props => props.variant === 'primary' && css`
    background: ${theme.colors.accent.blue};
    color: ${theme.colors.neutral.surface};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.accent.blueHover};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.medium};
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: ${theme.colors.neutral.surface};
    color: ${theme.colors.neutral.text};
    border: 1px solid ${theme.colors.neutral.border};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.neutral.surfaceHover};
      border-color: ${theme.colors.neutral.textMuted};
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background: transparent;
    color: ${theme.colors.accent.blue};
    border: 2px solid ${theme.colors.accent.blue};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.accent.blue};
      color: ${theme.colors.neutral.surface};
    }
  `}
  
  ${props => props.size === 'small' && css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.small};
  `}
  
  ${props => props.size === 'large' && css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.sizes.h3};
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.small};
  }
`;

Button.defaultProps = {
  variant: 'primary',
  size: 'medium'
};

export const IconButton = styled.button`
  padding: ${theme.spacing.xs};
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: ${theme.colors.neutral.surfaceHover};
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
