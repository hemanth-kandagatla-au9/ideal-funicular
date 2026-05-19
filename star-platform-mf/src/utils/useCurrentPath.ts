import { useEffect, useState } from 'react';

export const useCurrentPath = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(window.location.pathname);
    };

    // Detect back/forward browser navigation
    window.addEventListener('popstate', syncPath);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    // Detect remote pushState changes
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      syncPath();
    };

    // Detect remote replaceState changes
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args);
      syncPath();
    };

    return () => {
      window.removeEventListener('popstate', syncPath);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return currentPath;
};
