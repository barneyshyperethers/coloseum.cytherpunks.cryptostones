import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaWallet } from "react-icons/fa";

const LoginButton = () => {
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const walletAddress = wallets[0]?.address || user?.wallet?.address;

  useEffect(() => {
    if (authenticated && walletAddress) {
      const isRegistered = localStorage.getItem(
        `registration_${walletAddress}`
      );
      if (!isRegistered) {
        router.push("/login");
      }
    }
  }, [authenticated, walletAddress, router]);

  return (
    <button onClick={login}>
      <FaWallet />
    </button>
  );
};

export default LoginButton;
