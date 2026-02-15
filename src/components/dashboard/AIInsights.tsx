/**
 * AIInsights Component
 * Displays AI-generated insights with toggles
 */

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, Loader2 } from "lucide-react";

interface AIInsightsProps {
  userId: string;
  period: string;
  storeId: string;
}

export default function AIInsights({
  userId,
  period,
  storeId,
}: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("report");

  async function generateInsights(type: string = "all") {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          period,
          storeId,
          insightType: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights");
      }

      const data = await response.json();
      setInsights(data.insights);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  const tabs = [
    { id: "report", label: "📋 Performance Report", key: "performanceReport" },
    { id: "forecast", label: "📈 Sales Forecast", key: "salesForecast" },
    { id: "inventory", label: "📦 Inventory", key: "inventoryOptimization" },
    { id: "pricing", label: "💰 Pricing", key: "pricingOptimization" },
    { id: "churn", label: "👥 Churn", key: "churnPrediction" },
    { id: "india", label: "🇮🇳 India Insights", key: "indiaInsights" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        </div>

        <button
          onClick={() => generateInsights("all")}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Insights
            </>
          )}
        </button>
      </div>

      {!insights && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-gray-600 mb-4">
            Click "Generate Insights" to get AI-powered recommendations aur
            analysis
          </p>
          <p className="text-sm text-gray-500">
            Sales forecast, inventory tips, pricing strategies, aur bahut kuch!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ❌ Error: {error}
        </div>
      )}

      {insights && (
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? "block" : "hidden"}
              >
                {insights[tab.key] ? (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-2xl font-bold mb-4 text-gray-900"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-bold mb-3 mt-4 text-gray-800"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-lg font-semibold mb-2 mt-3 text-gray-800"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="mb-3 text-gray-700 leading-relaxed"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-3 space-y-1 text-gray-700"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside mb-3 space-y-1 text-gray-700"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {insights[tab.key]}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No insights available for this category
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
