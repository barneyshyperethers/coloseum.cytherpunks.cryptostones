import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface FeedCardProps {
  id: string;
  price: string;
  change: number;
  data: number[];
}

export function FeedCard({ id, price, change, data }: FeedCardProps) {
  const isPositive = change >= 0;
  const chartData = data.map((value) => ({ value }));

  return (
    <div className="group relative p-5 rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-sm border border-[rgba(0,224,255,0.15)] hover:border-[rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.15)] transition-all duration-300 hover:scale-[1.02]">
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(0,56,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        {/* Feed ID */}
        <div className="mb-3">
          <span className="text-xs uppercase tracking-wider text-[#8B8D98]">
            Feed ID
          </span>
          <h3 className="text-lg mt-1">{id}</h3>
        </div>

        {/* Mini Chart */}
        <div className="h-16 mb-3 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? "#00E0FF" : "#FF4458"}
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Price and Change */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-2xl">{price}</div>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isPositive
                ? "bg-[rgba(0,224,255,0.1)] text-[#00E0FF]"
                : "bg-[rgba(255,68,88,0.1)] text-[#FF4458]"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Buy Button */}
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0038FF] to-[#00E0FF] text-white hover:shadow-[0_0_20px_rgba(0,224,255,0.4)] transition-all duration-300 group-hover:scale-[1.02]">
          Buy Feed
        </button>
      </div>
    </div>
  );
}
