import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('Error caught by getDerivedStateFromError: ', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary: ', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { showFallbackUI, children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      // this.setState({ hasError: false });
      return showFallbackUI ? (
        <h4 style={{ textAlign: 'center', color: '#FF8500' }}>Failed to load.</h4>
      ) : null;
    }
    return children;
  }
}

export default ErrorBoundary;
