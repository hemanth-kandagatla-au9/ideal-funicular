import React, { Suspense, useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { history } from "../utils/utils";
import "./loading-bar.css";
import { UI_TEXTS } from "../components/common/Constants/label-contants";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <div>{UI_TEXTS.LOADING.SOMETHING_WENT_WRONG_IN_APP}</div>;
    }
    const { children } = this.props;

    return children;
  }
}

// Create a HOC
function ModuleHOC(WrappedComponent) {
  return function WithErrorBoundary(props) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        // Increment progress by 10% each time
        setProgress(prevProgress => (prevProgress + 10) % 110);
      }, 100);

      // Clear the interval when progress reaches 100%
      if (progress === 100) {
        clearInterval(interval);
      }

      return () => {
        clearInterval(interval);
      };
    }, [progress]);

    return (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div style={{ top: "60px !important", position: "absolute" }} className="custom-loading-bar">
              <LoadingBar
                className="custom-loading-bar"
                progress={progress}
                color="#c4321d"
                height={3}
                onLoaderFinished={() => {
                  setProgress(100);
                }}
              />
            </div>
          }
        >
          <WrappedComponent {...props} history={history} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

export default ModuleHOC;