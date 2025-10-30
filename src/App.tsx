import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { OracleData } from "./components/OracleData";
import { MarketplaceData } from "./components/MarketPlaceData";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Crypto Blue Blocks</h1>
          <WalletMultiButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OracleData />
          <MarketplaceData />
        </div>
      </main>

      <footer className="mt-16 py-6 text-center text-gray-400 text-sm border-t border-white/10">
        <p>© 2025. Made using <span className="text-purple-400">AImpact</span></p>
      </footer>
    </div>
  );
}

export default App;
