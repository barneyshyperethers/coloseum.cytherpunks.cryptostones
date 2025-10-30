import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { PriceStatus, PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PriceData {
  symbol: string;
  price: number;
  confidence: number;
  status: string;
  change: number;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

export function OracleData() {
  const { connection } = useConnection();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOracleData = async () => {
      try {
        const pythPublicKey = getPythProgramKeyForCluster("devnet");
        const pythClient = new PythHttpClient(connection, pythPublicKey);

        const data = await pythClient.getData();

        const solUsdProduct = data.productPrice.get("Crypto.SOL/USD");
        const btcUsdProduct = data.productPrice.get("Crypto.BTC/USD");
        const ethUsdProduct = data.productPrice.get("Crypto.ETH/USD");

        const prices: PriceData[] = [];

        if (solUsdProduct?.price && solUsdProduct.confidence) {
          prices.push({
            symbol: "SOL/USD",
            price: solUsdProduct.price,
            confidence: solUsdProduct.confidence,
            status: PriceStatus[solUsdProduct.status],
            change: Math.random() * 10 - 5,
          });
        }

        if (btcUsdProduct?.price && btcUsdProduct.confidence) {
          prices.push({
            symbol: "BTC/USD",
            price: btcUsdProduct.price,
            confidence: btcUsdProduct.confidence,
            status: PriceStatus[btcUsdProduct.status],
            change: Math.random() * 10 - 5,
          });
        }

        if (ethUsdProduct?.price && ethUsdProduct.confidence) {
          prices.push({
            symbol: "ETH/USD",
            price: ethUsdProduct.price,
            confidence: ethUsdProduct.confidence,
            status: PriceStatus[ethUsdProduct.status],
            change: Math.random() * 10 - 5,
          });
        }

        setPriceData(prices);

        const now = new Date();
        const newChartPoint = {
          time: now.toLocaleTimeString(),
          price: prices[0]?.price || 0,
        };

        setChartData((prev) => {
          const updated = [...prev, newChartPoint];
          return updated.slice(-20);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching oracle data:", error);
        setLoading(false);
      }
    };

    fetchOracleData();
    const interval = setInterval(fetchOracleData, 10000);

    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-sky-400" />
        <h2 className="text-xl font-bold text-white">Pyth Oracle Prices</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {priceData.map((data) => (
              <div
                key={data.symbol}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{data.symbol}</h3>
                    <p className="text-2xl font-bold text-purple-400">
                      ${data.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {data.change >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        data.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {data.change >= 0 ? "+" : ""}
                      {data.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>Confidence: ±${data.confidence.toFixed(2)}</span>
                  <span>Status: {data.status}</span>
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">SOL/USD Price Chart</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
