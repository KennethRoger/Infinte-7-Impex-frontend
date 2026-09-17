import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value (such as search input).
 * @param value The raw input value
 * @param delay Delay in milliseconds (default 350ms)
 * @returns The debounced value updated only after the delay has passed without changes
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
