'use client';

import { useState, useEffect } from 'react';

export function useServerStorage<T>(initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from server on mount (with automatic migration from localStorage)
    useEffect(() => {
        async function loadData() {
            try {
                // Check if there's data in localStorage (old storage method)
                const localData = localStorage.getItem('coupleAppData');

                if (localData) {
                    // Migrate from localStorage to server
                    console.log('Found localStorage data, migrating to server...');
                    const parsed = JSON.parse(localData);

                    // Upload to server
                    await fetch('/api/memories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: localData
                    });

                    // Clear localStorage after successful migration
                    localStorage.removeItem('coupleAppData');
                    console.log('Migration complete! ✅');

                    setStoredValue(parsed);
                } else {
                    // No local data, load from server
                    const response = await fetch('/api/memories');
                    const data = await response.json();
                    setStoredValue(data);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                // Fallback to initial value if both localStorage and server fail
                setStoredValue(initialValue);
            } finally {
                setIsLoaded(true);
            }
        }

        loadData();
    }, []); // Empty dependency array - only run once on mount

    // Save to server
    const setValue = async (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            // Save to server
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