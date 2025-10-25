"use client";

import { useState } from "react";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Algorithms", count: 24 },
    { id: "trading", name: "Trading", count: 12 },
    { id: "analytics", name: "Analytics", count: 8 },
    { id: "prediction", name: "Prediction", count: 4 },
  ];

  const algorithms = [
    {
      id: 1,
      name: "Advanced Trading Bot",
      vendor: "CryptoTrader Pro",
      price: "$299/month",
      rating: 4.8,
      description: "AI-powered trading algorithm with 95% accuracy",
      category: "trading",
      image: "https://assets.api.uizard.io/api/cdn/stream/acb8f2d3-5f1c-424b-a74b-7e045a75a50d.png"
    },
    {
      id: 2,
      name: "Market Sentiment Analyzer",
      vendor: "DataInsights",
      price: "$199/month",
      rating: 4.6,
      description: "Real-time sentiment analysis for crypto markets",
      category: "analytics",
      image: "https://assets.api.uizard.io/api/cdn/stream/124150c9-ee6f-436b-8ef6-3ee5b85bc7e6.png"
    },
    {
      id: 3,
      name: "Price Prediction Model",
      vendor: "PredictAI",
      price: "$399/month",
      rating: 4.9,
      description: "Machine learning model for price forecasting",
      category: "prediction",
      image: "https://assets.api.uizard.io/api/cdn/stream/210ae28c-8973-47c3-b396-a006beb83adb.png"
    },
    {
      id: 4,
      name: "Risk Management Suite",
      vendor: "SecureTrade",
      price: "$249/month",
      rating: 4.7,
      description: "Comprehensive risk assessment and management",
      category: "trading",
      image: "https://assets.api.uizard.io/api/cdn/stream/57930274-0ead-422e-8f82-94fe6ebba7e4.png"
    },
    {
      id: 5,
      name: "Portfolio Optimizer",
      vendor: "OptiPort",
      price: "$179/month",
      rating: 4.5,
      description: "Automated portfolio rebalancing and optimization",
      category: "analytics",
      image: "https://assets.api.uizard.io/api/cdn/stream/00d95412-0da1-4d66-809d-406eb3735184.png"
    },
    {
      id: 6,
      name: "Arbitrage Detector",
      vendor: "ArbMaster",
      price: "$329/month",
      rating: 4.8,
      description: "Real-time arbitrage opportunities across exchanges",
      category: "trading",
      image: "https://assets.api.uizard.io/api/cdn/stream/a8a2bd7c-2103-4a5d-a5be-baf64fedba92.png"
    }
  ];

  const filteredAlgorithms = selectedCategory === "all" 
    ? algorithms 
    : algorithms.filter(alg => alg.category === selectedCategory);

  return (
    <main className="bg-[#161616] text-white min-h-screen">
      <div className="w-[85%] mx-auto pt-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2aa5ff] mb-4">Algorithm Marketplace</h1>
          <p className="text-xl text-gray-400">Discover and deploy powerful AI trading algorithms</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <input
                className="w-full p-3 rounded-lg border border-gray-600 bg-[#323232] text-white placeholder-gray-400 pr-10"
                type="search"
                placeholder="Search algorithms..."
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="bg-[#2aa5ff] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#2aa5ff]/90 transition-colors">
              Search
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#2aa5ff] text-white'
                    : 'bg-[#323232] text-gray-400 hover:bg-[#404040]'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algorithm) => (
            <div key={algorithm.id} className="bg-[#323232] rounded-lg p-6 hover:bg-[#404040] transition-colors">
              <div className="mb-4">
                <div
                  className="w-full h-32 rounded-lg mb-4"
                  style={{
                    backgroundImage: `url('${algorithm.image}')`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <h3 className="text-xl font-semibold mb-2">{algorithm.name}</h3>
                <p className="text-gray-400 text-sm mb-2">by {algorithm.vendor}</p>
                <p className="text-gray-300 text-sm mb-4">{algorithm.description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm">{algorithm.rating}</span>
                </div>
                <span className="text-[#2aa5ff] font-bold">{algorithm.price}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-[#2aa5ff] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#2aa5ff]/90 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-transparent border border-[#2aa5ff] text-[#2aa5ff] font-bold py-2 px-4 rounded-lg hover:bg-[#2aa5ff]/10 transition-colors">
                  Try Demo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-[#323232] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#404040] transition-colors">
            Load More Algorithms
          </button>
        </div>
      </div>
    </main>
  );
}
