"use client";

import { usePrivy } from "@privy-io/react-auth";

function Privy() {
  const { ready } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  // Now it's safe to use other Privy hooks and state
  return <div>Privy is ready!</div>;
}
export default Privy;
