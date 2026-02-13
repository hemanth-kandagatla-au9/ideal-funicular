import React, { Suspense } from 'react';
import NotFound from '../pages/NotFound/NotFound';
import { CircleLoader } from 'react-spinners';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <NotFound />;
    }
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
