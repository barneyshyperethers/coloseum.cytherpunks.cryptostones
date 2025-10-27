"use client";

import { CgProfile } from "react-icons/cg";
import { IoNotifications } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { useWallet } from "../../contexts/WalletContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { 
    isConnected, 
    address, 
    connectWallet, 
    disconnectWallet, 
    isMetaMaskInstalled, 
    isLoading, 
    error 
  } = useWallet();
  
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleWalletClick = async () => {
    if (!isMetaMaskInstalled) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return;
    }

    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="navbar flex justify-between items-center p-4 px-8 relative">
      <div className="logo">
        <h1 className="text-2xl font-bold text-[#4a9eff] cosmic-text-glow cosmic-hover">
          Crypto Blue Blocks
        </h1>
      </div>
      <div className="menu flex gap-8">
        <ul className="flex space-x-4">
          <li>
            <a href="/marketplace" className="">
              Marketplace
            </a>
          </li>
          <li>
            <a href="#" className="">
              Workspace
            </a>
          </li>
          <li>
            <a href="#" className="">
              Docs
            </a>
          </li>
          <li>
            <a href="/help" className="">
              Help
            </a>
          </li>
        </ul>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <button 
              onClick={handleWalletClick}
              disabled={isLoading}
              className="p-2 hover:text-[#4a9eff] transition-colors disabled:opacity-50 cosmic-hover"
            >
              <FaWallet size={24} className="text-[#4a9eff]" />
            </button>
            {isConnected && address && (
              <div className="absolute top-full left-0 mt-2 text-white px-3 py-2 text-sm whitespace-nowrap z-50">
                Connected: {formatAddress(address)}
              </div>
            )}
          </div>
          <IoNotifications size={24} className="" />
          <a href="/login" className="p-2 hover:text-[#4a9eff] transition-colors cosmic-hover">
            <CgProfile size={24} className="" />
          </a>
        </div>
      </div>
      
      {/* Error Message */}
      {showError && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-red-400 px-4 py-2 text-sm z-50">
          {error || "Please install MetaMask to continue."}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
