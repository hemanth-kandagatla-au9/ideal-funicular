import React, { Suspense } from 'react';
import NotFound from '../pages/NotFound/NotFound';
import { CircleLoader } from 'react-spinners';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('loading CSS chunk') ||
      error?.message?.includes('Failed to fetch');

    if (isChunkError) {
      const reloadCount = parseInt(sessionStorage.getItem('mfe_chunk_reload') || '0');

      if (reloadCount < 1) {
        sessionStorage.setItem('mfe_chunk_reload', '1');
        window.location.reload();
        return { hasError: false };
      }
    }

    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) return <NotFound />;
    return this.props.children;
  }
}

function ModuleHOC(WrappedComponent) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircleLoader color="#825bff" />
            </div>
          }
        >
          <WrappedComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

export default ModuleHOC;
