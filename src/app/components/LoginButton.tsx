import { FaWallet } from "react-icons/fa";

const LoginButton = () => {
  const handleLogin = () => {
    // TODO: Implement wallet connection logic here
    console.log("Wallet connection not implemented yet");
  };

  return (
    <button onClick={handleLogin}>
      <FaWallet />
    </button>
  );
};

export default LoginButton;
