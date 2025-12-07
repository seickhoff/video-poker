import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for persisting state to localStorage
 * Handles serialization, deserialization, and error handling
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
    }
    return defaultValue;
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  // Return value and setter (supports both direct value and updater function)
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  return [storedValue, setValue];
}
