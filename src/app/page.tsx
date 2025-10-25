"use client";

import { useState, useEffect } from "react";
import { RegisterForm } from "./components/RegisterForm";
import Landing from "./components/Landing";

export default function Home() {
  return (
    <main className="bg-[#161616] text-white min-h-screen">
      <Landing />
    </main>
  );
}
