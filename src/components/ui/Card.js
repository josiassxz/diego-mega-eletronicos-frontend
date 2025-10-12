
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: ${theme.shadows.large};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin: 0;
`;

export const CardContent = styled.div`
  color: ${theme.colors.neutral.lightGray};
  line-height: 1.6;
`;

export const CardActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  color: ${theme.colors.accent.red};
  margin: ${theme.spacing.sm} 0;
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.neutral.lightGray};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
