import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { CreditCard } from 'lucide-react';
import { theme } from '../styles/theme';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;



const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.gradient.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  padding-bottom: 120px; /* Espaço para o rodapé */
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
    padding-bottom: 100px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    padding-bottom: 90px;
  }
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    gap: ${theme.spacing.xl};
  }
`;

const TextSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    align-items: center;
    text-align: center;
  }
`;

const LogoSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Subtitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${theme.colors.neutral.textSecondary};
  margin-bottom: ${theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const MainTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 4.5rem;
  font-weight: 800;
  color: ${theme.colors.neutral.text};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1;
  margin-bottom: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const AccentTitle = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 4.5rem;
  font-weight: 800;
  color: ${theme.colors.accent.blue};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 1;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 3.5rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo3D = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: ${theme.colors.neutral.textSecondary};
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: ${theme.shadows.text};
  transform: perspective(500px) rotateX(15deg);
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const StartButton = styled.button`
  background: ${theme.colors.gradient.primary};
  color: ${theme.colors.neutral.surface};
  border: none;
  padding: 18px 48px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: ${theme.spacing.xl};
  font-family: 'Montserrat', sans-serif;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(74, 144, 226, 0.4);
    background: linear-gradient(135deg, ${theme.colors.accent.blueHover} 0%, ${theme.colors.accent.teal} 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 16px 36px;
    font-size: 1.1rem;
  }
`;

const CarouselSection = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${theme.spacing.md} 0;
  background: ${theme.colors.neutral.surfaceHover};
  border-top: 1px solid ${theme.colors.neutral.border};
  z-index: 1000;
`;

const CarouselTitle = styled.h3`
  text-align: center;
  color: ${theme.colors.neutral.textSecondary};
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: ${theme.spacing.sm};
  text-shadow: none;
  opacity: 0.8;
`;

const CarouselTrack = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  position: relative;
  white-space: nowrap;
`;

const CarouselContainer = styled.div`
  display: flex;
  animation: slideInfinite 30s linear infinite;
  width: calc(200% + 40px);
`;

const CarouselItem = styled.div`
  flex: 0 0 auto;
  padding: 0 ${theme.spacing.lg};
  display: inline-flex;
  align-items: center;
`;

const BrandLogo = styled.img`
  height: 40px;
  width: auto;
  filter: brightness(0) invert(0.4);
  opacity: 0.6;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
    filter: brightness(0) invert(0.2);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 35px;
  }
`;

const slideInfinite = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;





const Home = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/cadastro-cliente');
  };

  return (
    <Container>
      <MainContent>
        <TextSection>
          <Subtitle>Bem-vindo à</Subtitle>
          <MainTitle>
            <CreditCard size={120} style={{marginBottom: '20px', color: theme.colors.accent.blue}} />
          </MainTitle>
          <AccentTitle>CELULAR<br />NO BOLETO</AccentTitle>
          <StartButton onClick={() => navigate('/cadastro-cliente')}>
            Cadastrar Cliente
          </StartButton>
        </TextSection>

        <LogoSection>
          <LogoContainer onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <Logo3D>
              PAY+<br />
            </Logo3D>
          </LogoContainer>
        </LogoSection>
      </MainContent>

      <CarouselSection>
        <CarouselTitle>Marcas Parceiras</CarouselTitle>
        <CarouselTrack>
          <CarouselContainer>
            <CarouselItem>
              <BrandLogo src="/assets/Samsung.png" alt="Samsung" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/xiaomi.png" alt="Xiaomi" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/motorola.png" alt="Motorola" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/lg.png" alt="LG" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/realme.png" alt="Realme" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/Samsung.png" alt="Samsung" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/xiaomi.png" alt="Xiaomi" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/motorola.png" alt="Motorola" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/lg.png" alt="LG" />
            </CarouselItem>
            <CarouselItem>
              <BrandLogo src="/assets/realme.png" alt="Realme" />
            </CarouselItem>
          </CarouselContainer>
        </CarouselTrack>
      </CarouselSection>
    </Container>
  );
};

export default Home;