
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Logo = styled.h1`
  font-size: ${theme.typography.sizes.hero};
  font-weight: ${theme.typography.weights.bold};
  background: linear-gradient(45deg, ${theme.colors.accent.red}, #ff6b4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.h1};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.h2};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.h3};
    margin-bottom: ${theme.spacing.md};
  }
`;

export const Heading = styled.h3`
  font-size: ${theme.typography.sizes.h3};
  font-weight: ${theme.typography.weights.semiBold};
  color: ${theme.colors.neutral.white};
  margin: 0;
`;

export const Text = styled.p`
  font-size: ${theme.typography.sizes.body};
  color: ${theme.colors.neutral.lightGray};
  line-height: 1.6;
  margin: 0;
`;

export const SmallText = styled.span`
  font-size: ${theme.typography.sizes.small};
  color: ${theme.colors.neutral.mediumGray};
`;
