import React from "react";
import { getFriendlyMessage, safeParseJson, toastApiError } from "../utils/apiErrors";

const useFetch = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const request = React.useCallback(async (url, options, { fallbackMessage } = {}) => {
    let response;
    let json;
    try {
      setError(null);
      setLoading(true);
      response = await fetch(url, options);
      json = await safeParseJson(response);
      if (!response.ok) {
        const message = toastApiError(json, fallbackMessage || getFriendlyMessage(json));
        throw new Error(message);
      }
    } catch (err) {
      json = null;
      setError(err);
    } finally {
      setData(json);
      setLoading(false);
      return { response, json };
    }
  }, []);

  return { data, error, loading, request };
};

export default useFetch;
