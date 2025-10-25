import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Building2, 
  Smartphone, 
  Users,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.isCollapsed ? '80px' : '280px'};
  background: ${theme.colors.neutral.surface};
  border-right: 1px solid ${theme.colors.neutral.border};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: ${theme.shadows.medium};

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    width: ${props => props.isCollapsed ? '70px' : '260px'};
  }

  /* Tablets */
  @media (max-width: ${theme.breakpoints.tablet}) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    width: 280px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 100vw;
    max-width: 320px;
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    width: ${props => props.isCollapsed ? '100px' : '320px'};
  }

  @media (min-width: 3440px) {
    width: ${props => props.isCollapsed ? '120px' : '360px'};
  }
`;

const SidebarHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.neutral.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    padding: ${theme.spacing.md};
    min-height: 70px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
    min-height: 60px;
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    padding: ${theme.spacing.xl};
    min-height: 90px;
  }

  @media (min-width: 3440px) {
    padding: ${theme.spacing.xl} ${theme.spacing.xxl};
    min-height: 100px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  h2 {
    font-size: ${theme.typography.sizes.h3};
    font-weight: ${theme.typography.weights.bold};
    background: ${theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;

    /* Monitores pequenos */
    @media (max-width: 1024px) {
      font-size: ${theme.typography.sizes.h4};
    }

    /* Mobile */
    @media (max-width: 480px) {
      font-size: ${theme.typography.sizes.h5};
    }

    /* Monitores ultrawide */
    @media (min-width: 2560px) {
      font-size: ${theme.typography.sizes.h2};
    }

    @media (min-width: 3440px) {
      font-size: ${theme.typography.sizes.h1};
    }
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.neutral.text};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.medium};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.neutral.surfaceHover};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: ${theme.colors.accent.blue};
  border: none;
  color: white;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.medium};
  cursor: pointer;
  box-shadow: ${theme.shadows.medium};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Mobile */
  @media (max-width: 480px) {
    top: 15px;
    left: 15px;
    padding: ${theme.spacing.xs};
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${theme.spacing.md} 0;
  overflow-y: auto;

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    padding: ${theme.spacing.sm} 0;
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: ${theme.spacing.xs} 0;
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    padding: ${theme.spacing.lg} 0;
  }

  @media (min-width: 3440px) {
    padding: ${theme.spacing.xl} 0;
  }
`;

const NavItem = styled.div`
  margin: 0 ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    margin: 0 ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.xxs};
  }

  /* Mobile */
  @media (max-width: 480px) {
    margin: 0 ${theme.spacing.xs};
    margin-bottom: 2px;
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    margin: 0 ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
  }

  @media (min-width: 3440px) {
    margin: 0 ${theme.spacing.lg};
    margin-bottom: ${theme.spacing.md};
  }
`;

const NavLink = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${props => props.isActive ? theme.colors.accent.blueLight : 'transparent'};
  border: none;
  border-radius: ${theme.borderRadius.medium};
  color: ${props => props.isActive ? theme.colors.accent.blue : theme.colors.neutral.text};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};

  &:hover {
    background: ${props => props.isActive ? theme.colors.accent.blueLight : theme.colors.neutral.surfaceHover};
  }

  svg {
    min-width: 20px;
    height: 20px;
  }

  span {
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.small};
    gap: ${theme.spacing.sm};

    svg {
      min-width: 18px;
      height: 18px;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.small};

    svg {
      min-width: 16px;
      height: 16px;
    }
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    padding: ${theme.spacing.lg};
    font-size: ${theme.typography.sizes.large};
    gap: ${theme.spacing.lg};

    svg {
      min-width: 24px;
      height: 24px;
    }
  }

  @media (min-width: 3440px) {
    padding: ${theme.spacing.xl};
    font-size: ${theme.typography.sizes.xl};
    gap: ${theme.spacing.xl};

    svg {
      min-width: 28px;
      height: 28px;
    }
  }
`;

const SidebarFooter = styled.div`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.neutral.border};

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    padding: ${theme.spacing.sm};
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: ${theme.spacing.xs};
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    padding: ${theme.spacing.lg};
  }

  @media (min-width: 3440px) {
    padding: ${theme.spacing.xl};
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: transparent;
  border: none;
  border-radius: ${theme.borderRadius.medium};
  color: ${theme.colors.status.error};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: ${theme.typography.sizes.body};
  font-weight: ${theme.typography.weights.medium};

  &:hover {
    background: ${theme.colors.status.errorLight};
  }

  svg {
    min-width: 20px;
    height: 20px;
  }

  span {
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }

  /* Monitores pequenos */
  @media (max-width: 1024px) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.small};
    gap: ${theme.spacing.sm};

    svg {
      min-width: 18px;
      height: 18px;
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.small};

    svg {
      min-width: 16px;
      height: 16px;
    }
  }

  /* Monitores ultrawide */
  @media (min-width: 2560px) {
    padding: ${theme.spacing.lg};
    font-size: ${theme.typography.sizes.large};
    gap: ${theme.spacing.lg};

    svg {
      min-width: 24px;
      height: 24px;
    }
  }

  @media (min-width: 3440px) {
    padding: ${theme.spacing.xl};
    font-size: ${theme.typography.sizes.xl};
    gap: ${theme.spacing.xl};

    svg {
      min-width: 28px;
      height: 28px;
    }
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.neutral.overlay};
  z-index: 999;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Building2,
      label: 'Cadastro de Empresas',
      path: '/cadastro-empresas'
    },
    {
      icon: Smartphone,
      label: 'Gestão de Aparelhos',
      path: '/cadastro-aparelhos'
    },
    {
      icon: Users,
      label: 'Gestão de Vendedores',
      path: '/cadastro-vendedores'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <MobileToggle onClick={toggleMobile}>
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </MobileToggle>

      <Overlay isOpen={isMobileOpen} onClick={() => setIsMobileOpen(false)} />

      <SidebarContainer isCollapsed={isCollapsed} isOpen={isMobileOpen}>
        <SidebarHeader>
          <Logo isCollapsed={isCollapsed}>
            <Building2 size={24} color={theme.colors.accent.blue} />
            <h2>Mega Eletrônicos</h2>
          </Logo>
          <CollapseButton onClick={toggleCollapse}>
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </CollapseButton>
        </SidebarHeader>

        <SidebarNav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem key={item.path}>
                <NavLink
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </NavItem>
            );
          })}
        </SidebarNav>

        <SidebarFooter>
          <LogoutButton isCollapsed={isCollapsed} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;