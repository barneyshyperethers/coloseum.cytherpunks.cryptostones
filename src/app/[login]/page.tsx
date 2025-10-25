"use client";

import { useState } from "react";

export default function LoginPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);

  const handleAccountTypeSelect = (type: string) => {
    setSelectedAccountType(type);
  };

  return (
    <main className="bg-[#161616] text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2aa5ff] mb-2">Choose Account Type</h1>
          <p className="text-gray-400">Select the type of account you want to create</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleAccountTypeSelect('personal')}
            className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
              selectedAccountType === 'personal'
                ? 'border-[#2aa5ff] bg-[#2aa5ff]/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">Register as User</h3>
              <p className="text-gray-400">Personal account for individuals</p>
            </div>
          </button>

          <button
            onClick={() => handleAccountTypeSelect('business')}
            className={`w-full p-6 rounded-lg border-2 transition-all duration-200 ${
              selectedAccountType === 'business'
                ? 'border-[#2aa5ff] bg-[#2aa5ff]/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">Register as Company</h3>
              <p className="text-gray-400">Business account for organizations</p>
            </div>
          </button>
        </div>

        {selectedAccountType && (
          <div className="mt-8 text-center">
            <button className="bg-[#2aa5ff] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#2aa5ff]/90 transition-colors">
              Continue with {selectedAccountType === 'personal' ? 'Personal' : 'Business'} Account
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
