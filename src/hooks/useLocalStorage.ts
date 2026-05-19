import { useCallback, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValueState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValueState(newValue);
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValueState(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }, [key, initialValue]);

  return {
    value,
    setValue,
    removeValue,
  };
};
