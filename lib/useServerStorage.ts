'use client';

import { useState, useEffect } from 'react';

export function useServerStorage<T>(initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from server on mount
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/memories');
                const data = await response.json();
                setStoredValue(data);
            } catch (error) {
                console.error('Error loading from server:', error);
            } finally {
                setIsLoaded(true);
            }
        }
        loadData();
    }, []);

    // Save to server
    const setValue = async (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(valueToStore),
            });
        } catch (error) {
            console.error('Error saving to server:', error);
        }
    };

    return [storedValue, setValue, isLoaded] as const;
}