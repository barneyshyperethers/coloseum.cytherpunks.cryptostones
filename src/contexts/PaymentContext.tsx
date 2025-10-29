"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  paymentHistory: PaymentRecord[];
  addPaymentRecord: (payment: PaymentRecord) => void;
  getPaymentStatus: (paymentId: string) => PaymentRecord | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  transactionHash?: string;
  method: 'phantom' | 'mastercard';
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addPaymentRecord = (payment: PaymentRecord) => {
    setPaymentHistory(prev => [payment, ...prev]);
  };

  const getPaymentStatus = (paymentId: string): PaymentRecord | null => {
    return paymentHistory.find(payment => payment.id === paymentId) || null;
  };

  const value: PaymentContextType = {
    paymentHistory,
    addPaymentRecord,
    getPaymentStatus,
    isLoading,
    setIsLoading,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
