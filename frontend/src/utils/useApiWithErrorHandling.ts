import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  makeRequest: (...args: any[]) => Promise<T | null>;
}

export function useApiWithErrorHandling<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    retryCount?: number;
  } = {}
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { onSuccess, onError, retryCount = 0 } = options;

  const makeRequest = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      
      let attempts = 0;
      
      while (attempts <= retryCount) {
        try {
          const result = await apiFunction(...args);
          setData(result);
          setIsLoading(false);
          
          if (onSuccess) {
            onSuccess(result);
          }
          
          return result;
        } catch (err) {
          attempts++;
          
          if (attempts <= retryCount) {
            // Wait before retrying (exponential backoff)
            await new Promise(r => setTimeout(r, 1000 * attempts));
            continue;
          }
          
          const error = err instanceof Error ? err : new Error('An unknown error occurred');
          setError(error);
          setIsLoading(false);
          
          if (onError) {
            onError(error);
          }
          
          return null;
        }
      }
      
      return null;
    },
    [apiFunction, onSuccess, onError, retryCount]
  );

  return { data, isLoading, error, makeRequest };
}