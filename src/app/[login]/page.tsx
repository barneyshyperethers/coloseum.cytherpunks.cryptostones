"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { RegisterForm } from "../components/RegisterForm";

export default function Home() {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address || user?.wallet?.address;

  return <RegisterForm walletAddress={walletAddress!} />;
}
