"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAccountTypeSelect = (type: string) => {
    setSelectedAccountType(type);
  };

  const handleContinue = () => {
    if (selectedAccountType === 'personal') {
      setShowRegistrationForm(true);
    } else {
      // Handle business account registration
      console.log('Business account registration');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleBackToAccountType = () => {
    setShowRegistrationForm(false);
    setSelectedAccountType(null);
  };

  if (showRegistrationForm) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#00BFFF] mb-2 cosmic-text-glow">Create Personal Account</h1>
            <p className="text-gray-400">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-gray-300 text-sm font-medium mb-2">
                Login
              </label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#1e1e3f] text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
                placeholder="Enter your username"
                required
                disabled={!isClient}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#1e1e3f] text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
                placeholder="Enter your email"
                required
                disabled={!isClient}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#1e1e3f] text-white placeholder-gray-400 focus:border-[#00BFFF] focus:outline-none"
                placeholder="Enter your password"
                required
                disabled={!isClient}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBackToAccountType}
                className="flex-1 text-gray-400 font-bold py-3 px-6 hover:text-gray-300 transition-colors"
                disabled={!isClient}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 text-[#00BFFF] font-bold py-3 px-6 hover:text-[#00BFFF] transition-colors cosmic-text-glow"
                disabled={!isClient}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00BFFF] mb-2 cosmic-text-glow">Choose Account Type</h1>
          <p className="text-gray-400">Select the type of account you want to create</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleAccountTypeSelect('personal')}
            className={`w-full p-6 border-2 transition-all duration-200 ${
              selectedAccountType === 'personal'
                ? 'border-[#00BFFF] text-[#00BFFF] cosmic-text-glow'
                : 'border-[#1e1e3f] text-gray-400 hover:text-[#00BFFF]'
            }`}
            disabled={!isClient}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">Register as User</h3>
              <p className="text-gray-400">Personal account for individuals</p>
            </div>
          </button>

          <button
            onClick={() => handleAccountTypeSelect('business')}
            className={`w-full p-6 border-2 transition-all duration-200 ${
              selectedAccountType === 'business'
                ? 'border-[#00BFFF] text-[#00BFFF] cosmic-text-glow'
                : 'border-[#1e1e3f] text-gray-400 hover:text-[#00BFFF]'
            }`}
            disabled={!isClient}
          >
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">Register as Company</h3>
              <p className="text-gray-400">Business account for organizations</p>
            </div>
          </button>
        </div>

        {selectedAccountType && (
          <div className="mt-8 text-center">
            <button 
              onClick={handleContinue}
              className="text-[#00BFFF] font-bold py-3 px-8 hover:text-[#00BFFF] transition-colors cosmic-text-glow"
              disabled={!isClient}
            >
              Continue with {selectedAccountType === 'personal' ? 'Personal' : 'Business'} Account
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
