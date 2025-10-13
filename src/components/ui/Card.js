
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Card = styled.div`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.small};
  
  &:hover {
    border-color: ${theme.colors.neutral.textMuted};
    box-shadow: ${theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral.borderLight};
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.text};
  margin: 0;
`;

export const CardContent = styled.div`
  color: ${theme.colors.neutral.textSecondary};
  line-height: 1.6;
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.neutral.borderLight};
`;

export const StatCard = styled(Card)`
  text-align: center;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

export const StatValue = styled.div`
  font-size: ${theme.typography.sizes.hero};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.accent.blue};
  margin: ${theme.spacing.sm} 0;
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.neutral.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
