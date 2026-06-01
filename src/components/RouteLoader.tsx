import { useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';
import { useState, useEffect } from 'react';

export function RouteLoader({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [previousLocation, setPreviousLocation] = useState(location.pathname);

  useEffect(() => {
    if (previousLocation !== location.pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, previousLocation]);

  useEffect(() => {
    setPreviousLocation(location.pathname);
  }, [location.pathname]);

  if (isLoading && location.pathname !== '/') {
    return <PageLoader />;
  }

  return <>{children}</>;
}