import React from "react";
import { STATUS_FEATURES, STATUS_HEALTH } from "../Api";
import { safeParseJson } from "../utils/apiErrors";

export const ServiceStatusContext = React.createContext({
  apiOnline: true,
  features: {},
  loading: true,
  refreshStatus: () => {},
});

export const ServiceStatusProvider = ({ children }) => {
  const [apiOnline, setApiOnline] = React.useState(true);
  const [features, setFeatures] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const fetchHealth = React.useCallback(async () => {
    try {
      const { url, options } = STATUS_HEALTH();
      const response = await fetch(url, options);
      setApiOnline(Boolean(response?.ok));
    } catch (error) {
      setApiOnline(false);
    }
  }, []);

  const fetchFeatures = React.useCallback(async () => {
    try {
      const { url, options } = STATUS_FEATURES();
      const response = await fetch(url, options);
      if (!response?.ok) return;

      const payload = await safeParseJson(response);
      setFeatures(payload?.features || payload || {});
    } catch (error) {
      // Ignore failures to avoid overwriting last known feature state
    }
  }, []);

  const refreshStatus = React.useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchHealth(), fetchFeatures()]);
    setLoading(false);
  }, [fetchHealth, fetchFeatures]);

  React.useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const value = React.useMemo(
    () => ({ apiOnline, features, loading, refreshStatus }),
    [apiOnline, features, loading, refreshStatus]
  );

  return (
    <ServiceStatusContext.Provider value={value}>
      {children}
    </ServiceStatusContext.Provider>
  );
};
