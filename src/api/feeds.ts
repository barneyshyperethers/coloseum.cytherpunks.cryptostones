// API functions for fetching feed data

export interface Feed {
  id: string;
  price: string;
  change: number;
  data: number[];
}

export interface Agent {
  name: string;
  description: string;
  status: "active" | "idle";
  feeds: number;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API function to fetch live feeds
export async function fetchLiveFeeds(): Promise<Feed[]> {
  await delay(800); // Simulate network delay
  
  return [
    {
      id: "FX.EUR/USD",
      price: "$1.0842",
      change: 0.23,
      data: [1.08, 1.079, 1.081, 1.083, 1.082, 1.084, 1.0842],
    },
    {
      id: "CRYPTO.BTC/USD",
      price: "$67,234",
      change: 2.45,
      data: [65000, 65800, 66200, 66800, 67000, 66900, 67234],
    },
    {
      id: "CRYPTO.ETH/USD",
      price: "$3,421",
      change: -1.12,
      data: [3500, 3480, 3460, 3440, 3430, 3425, 3421],
    },
    {
      id: "STOCK.AAPL",
      price: "$178.45",
      change: 1.87,
      data: [175, 176, 176.5, 177, 177.8, 178.2, 178.45],
    },
    {
      id: "COMMODITY.GOLD",
      price: "$2,034",
      change: 0.56,
      data: [2020, 2025, 2028, 2030, 2032, 2033, 2034],
    },
    {
      id: "CRYPTO.SOL/USD",
      price: "$98.67",
      change: 3.21,
      data: [92, 94, 95, 96.5, 97, 98, 98.67],
    },
    {
      id: "FX.GBP/USD",
      price: "$1.2634",
      change: -0.34,
      data: [1.268, 1.267, 1.266, 1.265, 1.264, 1.2638, 1.2634],
    },
    {
      id: "CRYPTO.ADA/USD",
      price: "$0.58",
      change: 4.12,
      data: [0.54, 0.55, 0.56, 0.565, 0.57, 0.575, 0.58],
    },
  ];
}

// Mock API function to fetch agents
export async function fetchAgents(): Promise<Agent[]> {
  await delay(600); // Simulate network delay
  
  return [
    {
      name: "SocialSentiment AI",
      description: "Analyzes Twitter, Reddit, and social media sentiment for crypto markets using advanced NLP models.",
      status: "active",
      feeds: 12,
    },
    {
      name: "MarketPredictor ML",
      description: "Machine learning agent that predicts price movements based on historical data and market indicators.",
      status: "active",
      feeds: 8,
    },
    {
      name: "NewsAggregator Pro",
      description: "Aggregates and analyzes news from 100+ sources, providing real-time market-moving insights.",
      status: "active",
      feeds: 24,
    },
    {
      name: "GitHub Activity Tracker",
      description: "Monitors development activity across blockchain projects to identify promising technologies.",
      status: "idle",
      feeds: 5,
    },
  ];
}

