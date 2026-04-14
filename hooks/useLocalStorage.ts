"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // ignore read errors
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const nextValue = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
          if (hydrated) {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          }
          return nextValue;
        });
      } catch {
        // ignore write errors
      }
    },
    [key, hydrated]
  );

  return [storedValue, setValue];
}
