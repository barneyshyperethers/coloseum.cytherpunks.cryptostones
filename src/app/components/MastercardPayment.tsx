"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { mockSmartContractService } from '../../services/SmartContractService';
import { TRANSAK_CONFIG } from '../../config/transak';

interface MastercardPaymentProps {
  amount: number;
  currency: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
  className?: string;
  buttonText?: string;
}

const MastercardPayment: React.FC<MastercardPaymentProps> = ({
  amount,
  currency = 'USD',
  onPaymentSuccess,
  onPaymentError,
  className = '',
  buttonText = 'Pay with Mastercard'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transakWidget, setTransakWidget] = useState<unknown>(null);
  const { address } = useWallet();

  // Initialize Transak widget
  useEffect(() => {
    const initTransak = () => {
      if (typeof window !== 'undefined' && window.Transak) {
        const widget = new window.Transak({
          apiKey: TRANSAK_CONFIG.API_KEY,
          environment: TRANSAK_CONFIG.ENVIRONMENT,
          defaultCryptoCurrency: TRANSAK_CONFIG.DEFAULT_CRYPTO_CURRENCY,
          defaultCryptoAmount: amount,
          defaultFiatCurrency: currency,
          defaultFiatAmount: amount,
          walletAddress: address || '',
          themeColor: TRANSAK_CONFIG.THEME_COLOR,
          hideMenu: TRANSAK_CONFIG.HIDE_MENU,
          isAutoFillUserData: TRANSAK_CONFIG.IS_AUTO_FILL_USER_DATA,
          userData: {
            firstName: '',
            lastName: '',
            email: '',
            mobileNumber: '',
            dob: '',
            address: {
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              postCode: '',
              countryCode: ''
            }
          },
          onTransakOrderCreated: (orderData: unknown) => {
            console.log('Transak order created:', orderData);
          },
          onTransakOrderSuccess: (orderData: unknown) => {
            console.log('Transak order success:', orderData);
            handlePaymentSuccess((orderData as { orderId: string }).orderId);
          },
          onTransakOrderFailed: (orderData: unknown) => {
            console.log('Transak order failed:', orderData);
            handlePaymentError((orderData as { error?: string }).error || 'Payment failed');
          },
          onTransakOrderCancelled: (orderData: unknown) => {
            console.log('Transak order cancelled:', orderData);
            handlePaymentError('Payment cancelled by user');
          }
        });

        setTransakWidget(widget);
      }
    };

    // Load Transak script if not already loaded
    if (typeof window !== 'undefined' && !window.Transak) {
      const script = document.createElement('script');
      script.src = 'https://global.transak.com/sdk/v1.1.0/transak.min.js';
      script.onload = initTransak;
      document.head.appendChild(script);
    } else {
      initTransak();
    }

    return () => {
      if (transakWidget && typeof transakWidget === 'object' && transakWidget !== null && 'close' in transakWidget) {
        (transakWidget as { close: () => void }).close();
      }
    };
  }, [amount, currency, address]);

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsLoading(false);
    
    try {
      // Call smart contract to confirm off-chain payment
      const txHash = await mockSmartContractService.confirmOffchainPayment(paymentId, 'completed');
      console.log('Payment confirmed on-chain:', txHash);
      
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentId);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      if (onPaymentError) {
        onPaymentError('Payment confirmed but failed to record on-chain');
      }
    }
  };

  const handlePaymentError = (error: string) => {
    setIsLoading(false);
    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  const openTransakWidget = () => {
    if (!transakWidget) {
      handlePaymentError('Payment widget not initialized');
      return;
    }

    if (!address) {
      handlePaymentError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    if (typeof transakWidget === 'object' && transakWidget !== null && 'init' in transakWidget) {
      (transakWidget as { init: () => void }).init();
    }
  };

  return (
    <button
      onClick={openTransakWidget}
      disabled={isLoading || !address}
      className={`
        flex items-center justify-center gap-2 px-3 py-1.5 
        bg-gradient-to-r from-[#00BFFF] to-[#0099CC] 
        hover:from-[#0099CC] hover:to-[#0077AA] 
        text-white font-medium rounded-md 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        cosmic-text-glow cosmic-hover text-sm
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          Processing...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Transak?: {
      new (config: unknown): {
        init: () => void;
        close: () => void;
      };
    };
  }
}

export default MastercardPayment;
