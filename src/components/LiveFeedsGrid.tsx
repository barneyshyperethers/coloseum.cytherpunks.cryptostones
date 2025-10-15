import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { FeedCard } from "./FeedCard";
import { fetchLiveFeeds } from "../api/feeds";

export function LiveFeedsGrid() {
  // Fetch feed data using React Query
  const { data: feeds, isLoading, isError } = useQuery({
    queryKey: ["liveFeeds"],
    queryFn: fetchLiveFeeds,
    refetchInterval: 10000, // Refetch every 10 seconds for live data
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="market">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl uppercase tracking-wider mb-4">
            Live Data Feeds
          </h2>
          <p className="text-[#8B8D98] max-w-2xl mx-auto">
            Real-time data streams from multiple sources, verified and delivered through our decentralized network
          </p>
        </motion.div>

        {isLoading && (
          <div className="text-center text-[#8B8D98] py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0038FF]"></div>
            <p className="mt-4">Loading live feeds...</p>
          </div>
        )}

        {isError && (
          <div className="text-center text-red-400 py-12">
            <p>Error loading feeds. Please try again later.</p>
          </div>
        )}

        {feeds && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {feeds.map((feed, index) => (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <FeedCard {...feed} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
