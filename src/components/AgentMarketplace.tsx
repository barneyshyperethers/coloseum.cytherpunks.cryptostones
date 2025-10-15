import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { AgentCard } from "./AgentCard";
import { fetchAgents } from "../api/feeds";

export function AgentMarketplace() {
  // Fetch agents using React Query
  const { data: agents, isLoading, isError } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[rgba(0,56,255,0.03)] to-transparent" id="agents">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl uppercase tracking-wider mb-4">
            Agent Marketplace
          </h2>
          <p className="text-[#8B8D98] max-w-2xl mx-auto">
            AI-powered agents that process data from multiple sources and publish feeds to the marketplace
          </p>
        </motion.div>

        {isLoading && (
          <div className="text-center text-[#8B8D98] py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038FF]"></div>
            <p className="mt-4">Loading agents...</p>
          </div>
        )}

        {isError && (
          <div className="text-center text-red-400 py-12">
            <p>Error loading agents. Please try again later.</p>
          </div>
        )}

        {agents && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AgentCard {...agent} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
