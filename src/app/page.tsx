"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { RegisterForm } from "./components/RegisterForm";

export default function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const walletAddress = wallets[0]?.address || user?.wallet?.address;

  useEffect(() => {
    if (authenticated && walletAddress) {
      const isRegistered = localStorage.getItem(
        `registration_${walletAddress}`
      );
      setShowRegisterForm(!isRegistered);
    } else {
      setShowRegisterForm(false);
    }
  }, [authenticated, walletAddress]);

  return (
    <div className="">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold">Crypto Blue Stones</h1>

        {!authenticated ? (
          <button
            onClick={login}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Login with Privy
          </button>
        ) : (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-sm">
              Logged in as: {user?.email?.address || walletAddress}
            </p>

            {showRegisterForm && walletAddress && (
              <RegisterForm walletAddress={walletAddress} />
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mt-4"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
