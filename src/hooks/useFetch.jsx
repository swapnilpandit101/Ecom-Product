import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Global In-Memory Cache and In-Flight Request Deduplication Maps
const globalApiCache = new Map();
const pendingRequests = new Map();

/**
 * Clear global in-memory API cache on catalog mutations (add/edit/delete)
 */
export const clearFetchCache = (targetUrl = null) => {
  if (targetUrl) {
    globalApiCache.delete(targetUrl);
    pendingRequests.delete(targetUrl);
  } else {
    globalApiCache.clear();
    pendingRequests.clear();
  }
};

/**
 * Reusable Custom React Hook for GET API fetching using Axios.
 * Includes request deduplication, in-memory caching, and live event syncing.
 * 
 * @param {string|null} url - The API endpoint URL to perform GET request.
 * @returns {object} { data, loading, error, refetch }
 */
function useFetch(url) {
  const [data, setData] = useState(() => (url && globalApiCache.has(url) ? globalApiCache.get(url) : null));
  const [loading, setLoading] = useState(() => (url && !globalApiCache.has(url)));
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    if (url) {
      clearFetchCache(url);
    }
    setReloadKey((prev) => prev + 1);
  }, [url]);

  // Listen to global product catalog update events for instant sync on operations
  useEffect(() => {
    const handleCatalogUpdate = () => {
      if (url) {
        clearFetchCache(url);
        setReloadKey((prev) => prev + 1);
      }
    };

    window.addEventListener('product-catalog-updated', handleCatalogUpdate);
    return () => {
      window.removeEventListener('product-catalog-updated', handleCatalogUpdate);
    };
  }, [url]);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;

    const fetchOrServeFromCache = async () => {
      // 1. Return from in-memory cache if available and not explicitly refetching
      if (globalApiCache.has(url) && reloadKey === 0) {
        const cachedData = globalApiCache.get(url);
        if (isMounted) {
          setData(cachedData);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);

      // 2. Reuse pending in-flight HTTP request if already fetching the exact same URL
      let requestPromise = pendingRequests.get(url);

      if (!requestPromise) {
        requestPromise = axios
          .get(url)
          .then((response) => {
            globalApiCache.set(url, response.data);
            pendingRequests.delete(url);
            return response.data;
          })
          .catch((err) => {
            pendingRequests.delete(url);
            throw err;
          });

        pendingRequests.set(url, requestPromise);
      }

      try {
        const responseData = await requestPromise;
        if (isMounted) {
          setData(responseData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`[useFetch Error] GET ${url}:`, err);
          const errorMsg = err.response?.data?.message || err.message || 'An error occurred while fetching data';
          setError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrServeFromCache();

    return () => {
      isMounted = false;
    };
  }, [url, reloadKey]);

  return { data, loading, error, refetch };
}

export default useFetch;

