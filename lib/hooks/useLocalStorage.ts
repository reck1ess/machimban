import React from "react";

const useLocalStorage = (key: string, initialValue: any): any[] => {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      return !!item ? JSON.parse(item) : initialValue;
    } else {
      return initialValue;
    }
  });

  const setValue = value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
