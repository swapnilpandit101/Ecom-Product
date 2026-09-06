import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Reusable Custom React Hook for GET API fetching using Axios.
 * 
 * @param {string|null} url - The API endpoint URL to perform GET request.
 * @param {object} options - Optional Axios request config.
 * @returns {object} { data, loading, error, refetch }
 */
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (err) {
      console.error(`[useFetch Error] GET ${url}:`, err);
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred while fetching data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
