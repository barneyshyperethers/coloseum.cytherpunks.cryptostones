"use client";

import { useState, useEffect } from "react";
import { RegisterForm } from "../components/RegisterForm";

export default function Home() {
  // TODO: Implement wallet connection logic here
  const walletAddress = null; // Placeholder for wallet address

  return <RegisterForm walletAddress={walletAddress} />;
}
