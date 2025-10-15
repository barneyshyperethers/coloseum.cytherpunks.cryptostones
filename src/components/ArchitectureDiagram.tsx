import { Database, Cpu, Globe, ShoppingCart, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export function ArchitectureDiagram() {
  const layers = [
    {
      title: "Data Sources (Off-chain)",
      icon: Database,
      description: "Blogs · Twitter · Reddit · GitHub · RSS",
      gradient: "from-[#0038FF]/20 to-[#0038FF]/5",
      borderColor: "border-[#0038FF]/30",
    },
    {
      title: "Signal Agents Layer",
      icon: Cpu,
      description: "AI/ML Docker agents publishing feeds",
      gradient: "from-[#5B8EFF]/20 to-[#5B8EFF]/5",
      borderColor: "border-[#5B8EFF]/30",
    },
    {
      title: "Oracle Layer (On-chain)",
      icon: Globe,
      description: "Ethereum · Solana · Polygon · BNB",
      gradient: "from-[#00E0FF]/20 to-[#00E0FF]/5",
      borderColor: "border-[#00E0FF]/30",
    },
    {
      title: "Marketplace Layer",
      icon: ShoppingCart,
      description: "Agent Registry · Billing · API Gateway",
      gradient: "from-[#00B8D4]/20 to-[#00B8D4]/5",
      borderColor: "border-[#00B8D4]/30",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="architecture">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl uppercase tracking-wider mb-4">
            System Architecture
          </h2>
          <p className="text-[#8B8D98] max-w-2xl mx-auto">
            A decentralized data infrastructure powered by AI agents and blockchain oracles
          </p>
        </motion.div>

        <div className="space-y-6">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div key={layer.title}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-r ${layer.gradient} backdrop-blur-sm border ${layer.borderColor} hover:shadow-[0_0_30px_rgba(0,224,255,0.2)] transition-all duration-300 group`}
                >
                  {/* Glass overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-[rgba(255,255,255,0.02)]"></div>

                  <div className="relative flex items-center gap-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#0038FF] to-[#00E0FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl mb-1 uppercase tracking-wide">
                        {layer.title}
                      </h3>
                      <p className="text-sm text-[#8B8D98]">
                        {layer.description}
                      </p>
                    </div>

                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(0,224,255,0.1)] border border-[rgba(0,224,255,0.3)] flex items-center justify-center">
                      <span className="text-[#00E0FF]">{index + 1}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Arrow between layers */}
                {index < layers.length - 1 && (
                  <div className="flex justify-center py-2">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowDown className="w-6 h-6 text-[#00E0FF]/50" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
