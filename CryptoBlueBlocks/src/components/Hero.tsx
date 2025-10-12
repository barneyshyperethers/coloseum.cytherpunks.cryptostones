import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0038FF]/10 via-transparent to-transparent"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00E0FF]/30 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `-100%`,
              width: `${Math.random() * 300 + 200}px`,
            }}
            animate={{
              left: ["0%", "200%"],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,224,255,0.1)] border border-[rgba(0,224,255,0.2)] mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#00E0FF]" />
          <span className="text-sm text-[#00E0FF]">Web3 Data Marketplace</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 uppercase"
        >
          <span className="bg-gradient-to-r from-white via-[#00E0FF] to-[#0038FF] bg-clip-text text-transparent">
            Unique price and data feeds
          </span>
          <br />
          <span className="text-white">which you can buy on our market</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-[#8B8D98] max-w-2xl mx-auto mb-10"
        >
          Access real-time data from trusted sources, powered by AI agents and delivered through decentralized oracles
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0038FF] to-[#00E0FF] text-white hover:shadow-[0_0_30px_rgba(0,224,255,0.6)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
            Explore Market
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-3.5 rounded-full border-2 border-[#00E0FF] text-[#00E0FF] hover:bg-[rgba(0,224,255,0.1)] transition-all duration-300 hover:scale-105">
            Learn More
          </button>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#0038FF]/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#00E0FF]/20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
    </section>
  );
}
