"use client";

import { useState, useEffect } from "react";
import { RegisterForm } from "../components/RegisterForm";

export default function Home() {
  const walletAddress = ""; // You'll need to handle wallet address differently now

  return <RegisterForm walletAddress={walletAddress!} />;
}
