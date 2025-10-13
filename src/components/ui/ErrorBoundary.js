import React from 'react';
import { theme } from '../../styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log the error details for debugging
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
    this.setState({ info });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const containerStyle = {
        padding: '24px',
        margin: '16px',
        borderRadius: '12px',
        background: theme.colors.neutral.surface,
        border: `1px solid ${theme.colors.neutral.border}`,
        color: theme.colors.neutral.text,
        fontFamily: 'Inter, Roboto, sans-serif',
      };

      const titleStyle = {
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
      };

      const textStyle = {
        fontSize: '14px',
        opacity: 0.9,
        marginBottom: '16px',
      };

      const buttonBarStyle = {
        display: 'flex',
        gap: '8px',
      };

      const buttonStyle = {
        padding: '10px 14px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        background: theme.colors.accent.blue,
        color: theme.colors.neutral.surface,
        fontWeight: 600,
      };

      const secondaryButtonStyle = {
        ...buttonStyle,
        background: theme.colors.neutral.surfaceHover,
        color: theme.colors.neutral.text,
      };

      return (
        <div style={containerStyle}>
          <div style={titleStyle}>Algo deu errado.</div>
          <div style={textStyle}>
            Ocorreu um erro inesperado na interface. Você pode tentar novamente
            ou recarregar a página.
          </div>
          <div style={buttonBarStyle}>
            <button type="button" style={buttonStyle} onClick={this.handleRetry}>
              Tentar novamente
            </button>
            <button type="button" style={secondaryButtonStyle} onClick={this.handleReload}>
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;