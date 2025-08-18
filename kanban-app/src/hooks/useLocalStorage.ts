'use client'

import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
  }
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const serialize = options?.serialize || JSON.stringify
  const deserialize = options?.deserialize || JSON.parse

  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keeps working
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [initialValue, key, deserialize])

  // Initialize with initialValue to avoid hydration mismatch
  // LocalStorage value will be loaded in useEffect
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        setStoredValue(prevValue => {
          const valueToStore = value instanceof Function ? value(prevValue) : value

          // Save to local storage
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, serialize(valueToStore))
          }
          
          return valueToStore
        })
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, serialize]
  )

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Initial load from localStorage
  useEffect(() => {
    setStoredValue(readValue())
  }, []) // Remove readValue from dependencies to prevent infinite loop

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only update if the change is from a different window/tab
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error parsing storage value for key "${key}":`, error)
        }
      }
    }

    // Only listen to storage events from other windows/tabs
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, deserialize])

  return [storedValue, setValue, removeValue]
}