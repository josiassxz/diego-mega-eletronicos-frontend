
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.md};
  }
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${props => props.gap || theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

export const Section = styled.section`
  background: ${theme.colors.neutral.surface};
  border: 1px solid ${theme.colors.neutral.border};
  border-radius: ${theme.borderRadius.large};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.small};
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || theme.spacing.md};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;
