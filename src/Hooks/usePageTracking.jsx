import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Garante que o dataLayer existe
    window.dataLayer = window.dataLayer || [];
    
    // Envia evento de pageview para o GTM
    window.dataLayer.push({
      event: 'page_view',
      page_path: location.pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location]);
};