
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
    background: ${theme.colors.accent.red};
    color: ${theme.colors.neutral.white};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.accent.redHover};
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.medium};
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background: rgba(255, 255, 255, 0.1);
    color: ${theme.colors.neutral.white};
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }
  `}
  
  ${props => props.variant === 'outline' && css`
    background: transparent;
    color: ${theme.colors.neutral.white};
    border: 2px solid ${theme.colors.accent.red};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.accent.red};
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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.neutral.white};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
