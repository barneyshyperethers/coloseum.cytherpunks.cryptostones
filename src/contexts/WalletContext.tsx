"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isMetaMaskInstalled: boolean;
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
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(!!window.ethereum);
    }
  }, []);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setAddress(address);
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
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setAddress(null);
        } else {
          // User switched accounts
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        setIsConnected(true);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
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
    isMetaMaskInstalled,
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
    ethereum?: any;
  }
}
