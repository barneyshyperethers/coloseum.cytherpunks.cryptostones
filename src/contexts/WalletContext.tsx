"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isPhantomInstalled: boolean;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Phantom is installed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPhantomInstalled(!!window.solana?.isPhantom);
    }
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.solana?.isPhantom) {
        try {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          if (response.publicKey) {
            setAddress(response.publicKey.toString());
            setIsConnected(true);
          }
        } catch (error) {
          console.log('No existing connection found');
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      const handleAccountChange = (publicKey: PublicKey | null) => {
        if (publicKey) {
          setAddress(publicKey.toString());
          setIsConnected(true);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      };

      window.solana.on('accountChanged', handleAccountChange);

      return () => {
        if (window.solana?.removeListener) {
          window.solana.removeListener('accountChanged', handleAccountChange);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (!window.solana?.isPhantom) {
      setError('Please install Phantom wallet to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await window.solana.connect();
      if (response.publicKey) {
        setAddress(response.publicKey.toString());
        setIsConnected(true);
      }
    } catch (error: unknown) {
      console.error('Error connecting wallet:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        setError('Connection rejected by user.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
  };

  const value: WalletContextType = {
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    isPhantomInstalled,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (args: unknown) => void) => void;
      removeListener: (event: string, callback: (args: unknown) => void) => void;
    };
  }
}
