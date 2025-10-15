import { Bot, ExternalLink, Activity } from "lucide-react";
import { motion } from "motion/react";

interface AgentCardProps {
  name: string;
  description: string;
  status: "active" | "idle";
  feeds: number;
}

export function AgentCard({ name, description, status, feeds }: AgentCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative p-6 rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-sm border border-[rgba(0,224,255,0.15)] hover:border-[rgba(0,224,255,0.4)] hover:shadow-[0_0_25px_rgba(0,224,255,0.15)] transition-all duration-300 group"
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(0,56,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0038FF] to-[#00E0FF] flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status === "active"
                      ? "bg-[#00E0FF] shadow-[0_0_8px_rgba(0,224,255,0.6)]"
                      : "bg-[#8B8D98]"
                  }`}
                ></div>
                <span className="text-xs text-[#8B8D98] uppercase tracking-wider">
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(0,224,255,0.1)]">
            <Activity className="w-3 h-3 text-[#00E0FF]" />
            <span className="text-xs text-[#00E0FF]">{feeds} feeds</span>
          </div>
        </div>

        <p className="text-sm text-[#8B8D98] mb-4 leading-relaxed">
          {description}
        </p>

        <button className="w-full py-2.5 rounded-xl border border-[#00E0FF] text-[#00E0FF] hover:bg-[rgba(0,224,255,0.1)] transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,224,255,0.3)]">
          View API
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
