"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Languages,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<{
    forecast?: any;
    profit?: any;
    churn?: any;
    marketing?: any;
  }>({});

  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [showLangPicker, setShowLangPicker] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  /**
   * Fetch saved insights from DB
   */
  async function fetchSavedInsights(lang: "en" | "hi") {
    try {
      setLoadingInitial(true);
      const res = await fetch(`/api/ai/insights?storeId=all&language=${lang}`);
      const result = await res.json();

      if (result.success && result.data) {
        const newInsights: any = {};
        result.data.forEach((item: any) => {
          newInsights[item.type] = item.content;
        });
        setInsights(newInsights);
      }
    } catch (err) {
      console.error("Failed to fetch insights:", err);
    } finally {
      setLoadingInitial(false);
    }
  }

  useEffect(() => {
    fetchSavedInsights(language);
  }, [language]);

  /**
   * Generate specific insight
   */
  async function generateInsight(type: string, targetLang: "en" | "hi") {
    try {
      setShowLangPicker(null);
      setGenerating((prev) => ({ ...prev, [type]: true }));
      setErrors((prev) => ({ ...prev, [type]: "" }));

      console.log(`🤖 Requesting ${type} insight in ${targetLang}...`);

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insightType: type,
          storeId: "all",
          language: targetLang,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate insight");
      }

      setInsights((prev) => ({ ...prev, [type]: result.data }));
      console.log(`✅ ${type} insight saved & updated in DB`);
    } catch (error) {
      console.error(`❌ Error generating ${type} insight:`, error);
      setErrors((prev) => ({
        ...prev,
        [type]: error instanceof Error ? error.message : String(error),
      }));
    } finally {
      setGenerating((prev) => ({ ...prev, [type]: false }));
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            🤖 AI Prediction Center
          </h1>
          <p className="text-lg text-gray-600">
            E-commerce intelligence powered by{" "}
            <span className="text-blue-600 font-semibold">
              Gemini 1.5 Flash
            </span>
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${
              language === "en"
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            English
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center ${
              language === "hi"
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Languages className="w-4 h-4 mr-2" />
            Hinglish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SALES FORECAST CARD */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-2xl mr-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sales Forecast
                </h2>
                <p className="text-sm text-gray-500">
                  30-day revenue prediction
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setShowLangPicker(
                    showLangPicker === "forecast" ? null : "forecast",
                  )
                }
                disabled={generating.forecast}
                className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
                  generating.forecast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200"
                }`}
              >
                {generating.forecast ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>

              {showLangPicker === "forecast" && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-2 tracking-widest leading-none">
                    Choose Language
                  </p>
                  <button
                    onClick={() => generateInsight("forecast", "en")}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    English Insight
                  </button>
                  <button
                    onClick={() => generateInsight("forecast", "hi")}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    Hinglish Insight
                  </button>
                </div>
              )}
            </div>
          </div>

          {errors.forecast && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium">
                {errors.forecast}
              </p>
            </div>
          )}

          {insights.forecast ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                    Predicted Revenue
                  </p>
                  <p className="text-xl font-black text-blue-900">
                    ₹{insights.forecast.predictedRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                    Growth Rate
                  </p>
                  <p className="text-xl font-black text-green-900">
                    +{insights.forecast.growthRate}%
                  </p>
                </div>
                <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
                    Confidence
                  </p>
                  <p className="text-xl font-black text-purple-900">
                    {insights.forecast.confidence}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="text-blue-500 mr-2" /> Patterns
                    Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.forecast.seasonalPatterns.map(
                      (p: string, i: number) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold"
                        >
                          {p}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <TrendingUp className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No forecast generated yet</p>
            </div>
          )}
        </section>

        {/* PROFIT OPTIMIZATION CARD */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-2xl mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Profit Strategies
                </h2>
                <p className="text-sm text-gray-500">
                  Pricing & margin optimization
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setShowLangPicker(
                    showLangPicker === "profit" ? null : "profit",
                  )
                }
                disabled={generating.profit}
                className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
                  generating.profit
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg shadow-green-200"
                }`}
              >
                {generating.profit ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>

              {showLangPicker === "profit" && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-2 tracking-widest leading-none">
                    Choose Language
                  </p>
                  <button
                    onClick={() => generateInsight("profit", "en")}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    English Insight
                  </button>
                  <button
                    onClick={() => generateInsight("profit", "hi")}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    Hinglish Insight
                  </button>
                </div>
              )}
            </div>
          </div>

          {insights.profit ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              {insights.profit.increasePrice?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="text-green-500 mr-2" /> Increase
                    Price Opportunities
                  </h3>
                  <div className="space-y-3">
                    {insights.profit.increasePrice
                      .slice(0, 2)
                      .map((item: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 bg-green-50/50 border border-green-100 rounded-2xl"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900 leading-tight">
                              {item.productName}
                            </h4>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-black">
                              +
                              {Math.round(
                                ((item.suggestedPrice - item.currentPrice) /
                                  item.currentPrice) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                          <p className="text-xs text-green-700 font-medium line-clamp-2">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <DollarSign className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No results generated yet</p>
            </div>
          )}
        </section>

        {/* CHURN PREDICTION CARD */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-2xl mr-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Churn Risk</h2>
                <p className="text-sm text-gray-500">
                  At-risk customer identification
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setShowLangPicker(showLangPicker === "churn" ? null : "churn")
                }
                disabled={generating.churn}
                className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
                  generating.churn
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-lg shadow-red-200"
                }`}
              >
                {generating.churn ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>

              {showLangPicker === "churn" && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-2 tracking-widest leading-none">
                    Choose Language
                  </p>
                  <button
                    onClick={() => generateInsight("churn", "en")}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    English Insight
                  </button>
                  <button
                    onClick={() => generateInsight("churn", "hi")}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    Hinglish Insight
                  </button>
                </div>
              )}
            </div>
          </div>

          {insights.churn ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-red-50 rounded-2xl p-6 mb-6">
                <div className="flex items-end justify-between mb-2">
                  <p className="text-sm font-bold text-red-800">
                    High Risk Customers
                  </p>
                  <p className="text-4xl font-black text-red-600">
                    {insights.churn.highRiskCustomers.length}
                  </p>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-4">
                {insights.churn.highRiskCustomers
                  .slice(0, 3)
                  .map((customer: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border-b border-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 mr-3">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Last seen {customer.daysSinceLastPurchase}d ago
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-red-600">
                          {customer.churnRisk}% Risk
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <Users className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No results generated yet</p>
            </div>
          )}
        </section>

        {/* MARKETING STRATEGY CARD */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-2xl mr-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Growth Strategy
                </h2>
                <p className="text-sm text-gray-500">
                  Target campaigns & budgets
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setShowLangPicker(
                    showLangPicker === "marketing" ? null : "marketing",
                  )
                }
                disabled={generating.marketing}
                className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
                  generating.marketing
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-200"
                }`}
              >
                {generating.marketing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Strategizing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>

              {showLangPicker === "marketing" && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-2 tracking-widest leading-none">
                    Choose Language
                  </p>
                  <button
                    onClick={() => generateInsight("marketing", "en")}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    English Insight
                  </button>
                  <button
                    onClick={() => generateInsight("marketing", "hi")}
                    className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-xl text-sm font-bold text-gray-700 transition-colors"
                  >
                    Hinglish Insight
                  </button>
                </div>
              )}
            </div>
          </div>

          {insights.marketing ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
              {insights.marketing.campaigns
                .slice(0, 2)
                .map((campaign: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 border border-purple-100 bg-purple-50/30 rounded-3xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-extrabold text-purple-900 text-lg leading-tight">
                        {campaign.name}
                      </h4>
                      <span className="text-xs font-black text-white bg-purple-600 px-3 py-1 rounded-full">
                        {campaign.roi} ROI
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs font-bold text-purple-700 bg-white px-3 py-2 rounded-xl border border-purple-100">
                        Channel: {campaign.channel}
                      </div>
                      <div className="text-xs font-bold text-purple-700 bg-white px-3 py-2 rounded-xl border border-purple-100">
                        Budget: ₹{campaign.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
              <Target className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No strategy generated yet</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
