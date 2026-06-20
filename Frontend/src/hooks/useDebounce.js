import { useState, useEffect } from 'react';

/**
 * Delays updating a value until the user stops typing for `delay` ms.
 * @param {*} value - The value to debounce
 * @param {number} delay - Milliseconds to wait (default 400)
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
