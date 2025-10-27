"use client";

import { useState, useEffect } from "react";
import { RegisterForm } from "./components/RegisterForm";
import Landing from "./components/Landing";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Landing />
    </main>
  );
}
