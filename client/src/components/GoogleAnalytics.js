import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-2P0J8H3LFQ", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;