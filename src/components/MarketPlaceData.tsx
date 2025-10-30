import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { ShoppingCart, Package, DollarSign, Users } from "lucide-react";

interface MarketplaceStats {
  totalListings: number;
  totalVolume: number;
  activeUsers: number;
  avgPrice: number;
}

interface Listing {
  id: string;
  name: string;
  price: number;
  seller: string;
  image: string;
}

export function MarketplaceData() {
  const { connection } = useConnection();
  const [stats, setStats] = useState<MarketplaceStats>({
    totalListings: 0,
    totalVolume: 0,
    activeUsers: 0,
    avgPrice: 0,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockStats: MarketplaceStats = {
          totalListings: Math.floor(Math.random() * 1000) + 500,
          totalVolume: Math.random() * 100000 + 50000,
          activeUsers: Math.floor(Math.random() * 500) + 200,
          avgPrice: Math.random() * 10 + 1,
        };

        const mockListings: Listing[] = [
          {
            id: "1",
            name: "Solana Monkey #1234",
            price: 12.5,
            seller: "7xKX...9pQm",
            image: "🐵",
          },
          {
            id: "2",
            name: "DeGods #5678",
            price: 45.2,
            seller: "3mNv...7kLp",
            image: "👹",
          },
          {
            id: "3",
            name: "Okay Bears #9012",
            price: 8.7,
            seller: "9qRt...2wXy",
            image: "🐻",
          },
          {
            id: "4",
            name: "Mad Lads #3456",
            price: 23.1,
            seller: "5hYu...4mNb",
            image: "😎",
          },
        ];

        setStats(mockStats);
        setListings(mockListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        setLoading(false);
      }
    };

    fetchMarketplaceData();
    const interval = setInterval(fetchMarketplaceData, 15000);

    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-sky-400" />
        <h2 className="text-xl font-bold text-white">Marketplace Stats</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-sky-400" />
                <span className="text-sm text-gray-400">Total Listings</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalListings}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Total Volume</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.totalVolume.toFixed(0)} SOL
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-sky-400" />
                <span className="text-sm text-gray-400">Active Users</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-gray-400">Avg Price</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.avgPrice.toFixed(2)} SOL</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Listings</h3>
            <div className="space-y-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-sky-400/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
                      {listing.image}
                    </div>
                    <div>
                      <p className="text-white font-medium">{listing.name}</p>
                      <p className="text-sm text-gray-400">Seller: {listing.seller}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sky-400">{listing.price} SOL</p>
                    <button className="text-xs text-gray-400 hover:text-white transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
