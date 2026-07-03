"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SystemStatusContextType = {
    isOnline: boolean;
    toggleOnline: () => void;
    setOnline: (status: boolean) => void;
    isVaultOnline: boolean;
    toggleVaultOnline: () => void;
    setVaultOnline: (status: boolean) => void;
};

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined);

export function SystemStatusProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isVaultOnline, setIsVaultOnline] = useState(true);

    // Initialize from localStorage and listen for changes
    React.useEffect(() => {
        // Initial load - Terminal
        const stored = localStorage.getItem('system_status');
        if (stored !== null) {
            setIsOnline(stored === 'online');
        }

        // Initial load - Vault
        const vaultStored = localStorage.getItem('vault_status');
        if (vaultStored !== null) {
            setIsVaultOnline(vaultStored === 'online');
        }

        // Cross-tab sync
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'system_status') {
                setIsOnline(e.newValue === 'online');
            }
            if (e.key === 'vault_status') {
                setIsVaultOnline(e.newValue === 'online');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const toggleOnline = () => {
        setIsOnline(prev => {
            const newState = !prev;
            localStorage.setItem('system_status', newState ? 'online' : 'offline');
            return newState;
        });
    };

    const toggleVaultOnline = () => {
        setIsVaultOnline(prev => {
            const newState = !prev;
            localStorage.setItem('vault_status', newState ? 'online' : 'offline');
            return newState;
        });
    };

    const setOnline = (status: boolean) => {
        setIsOnline(status);
        localStorage.setItem('system_status', status ? 'online' : 'offline');
    };

    const setVaultOnline = (status: boolean) => {
        setIsVaultOnline(status);
        localStorage.setItem('vault_status', status ? 'online' : 'offline');
    };

    return (
        <SystemStatusContext.Provider value={{ isOnline, toggleOnline, setOnline, isVaultOnline, toggleVaultOnline, setVaultOnline }}>
            {children}
        </SystemStatusContext.Provider>
    );
}

export function useSystemStatus() {
    const context = useContext(SystemStatusContext);
    if (context === undefined) {
        throw new Error('useSystemStatus must be used within a SystemStatusProvider');
    }
    return context;
}
