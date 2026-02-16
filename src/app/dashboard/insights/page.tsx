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
  Map,
  Rocket,
  Brain,
  Box,
  Zap,
  Search,
  ShieldCheck,
  Truck,
  FileText,
  MessageSquare,
  BarChart4,
} from "lucide-react";
import { useEffect } from "react";

export default function AIInsightsPage() {
  const [user, setUser] = useState<any>(null);
  const [insights, setInsights] = useState<{
    forecast?: any;
    profit?: any;
    churn?: any;
    marketing?: any;
    regional?: any;
    growth?: any;
    behavior?: any;
    product?: any;
    geo?: any;
    zeroClick?: any;
    logistics?: any;
    content?: any;
    sentiment?: any;
    benchmark?: any;
  }>({});

  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [showLangPicker, setShowLangPicker] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  /**
   * Fetch saved insights from DB
   */
  async function fetchData(lang: "en" | "hi") {
    try {
      setLoadingInitial(true);
      const [userRes, insightsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch(`/api/ai/insights?storeId=all&language=${lang}`),
      ]);

      const userData = await userRes.json();
      const insightsData = await insightsRes.json();

      if (userData.user) setUser(userData.user);

      if (insightsData.success && insightsData.data) {
        const newInsights: any = {};
        insightsData.data.forEach((item: any) => {
          newInsights[item.type] = item.content;
        });
        setInsights(newInsights);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoadingInitial(false);
    }
  }

  useEffect(() => {
    fetchData(language);
  }, [language]);

  /**
   * grll Insights at once
   */
  async function generateAllInsights(targetLang: "en" | "hi") {
    if (!user?.limits?.aiInsights) return;

    try {
      setIsGeneratingAll(true);
      setShowLangPicker(false);
      setErrors({});

      console.log(`🤖 Requesting UNIFIED intelligence in ${targetLang}...`);

      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insightType: "all",
          storeId: "all",
          language: targetLang,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.error || "Failed to generate unified intelligence",
        );
      }

      // Update state with all results
      setInsights({
        forecast: result.data.forecast,
        profit: result.data.profit,
        churn: result.data.churn,
        marketing: result.data.marketing,
        regional: result.data.regional,
        growth: result.data.growth,
        behavior: result.data.behavior,
        product: result.data.product,
        geo: result.data.geo,
        zeroClick: result.data.zeroClick,
        logistics: result.data.logistics,
        content: result.data.content,
        sentiment: result.data.sentiment,
        benchmark: result.data.benchmark,
      });

      console.log(`✅ All 14 intelligence modules updated & saved in DB`);
    } catch (error) {
      console.error(`❌ Error generating unified intelligence:`, error);
      setErrors({
        global: error instanceof Error ? error.message : "Generation failed",
      });
    } finally {
      setIsGeneratingAll(false);
    }
  }

  // Check if feature is locked
  const isLocked = user && !user.limits?.aiInsights;

  /**
   * Helper to render a module card
   */
  const ModuleCard = ({
    title,
    subtitle,
    icon: Icon,
    data,
    type,
    colorClass = "blue",
    children,
  }: any) => {
    // Utility to get Tailwind classes safely
    const colorStyles: any = {
      blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        border: "border-blue-100",
      },
      orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        border: "border-orange-100",
      },
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        border: "border-green-100",
      },
      red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-100" },
      indigo: {
        bg: "bg-indigo-50",
        icon: "text-indigo-600",
        border: "border-indigo-100",
      },
      pink: {
        bg: "bg-pink-50",
        icon: "text-pink-600",
        border: "border-pink-100",
      },
      cyan: {
        bg: "bg-cyan-50",
        icon: "text-cyan-600",
        border: "border-cyan-100",
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        border: "border-purple-100",
      },
    };

    const style = colorStyles[colorClass] || colorStyles.blue;

    return (
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div className={`p-3 ${style.bg} rounded-2xl mr-4`}>
            <Icon className={`w-8 h-8 ${style.icon}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-none mb-1">
              {title}
            </h2>
            <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
          </div>
        </div>

        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex-grow">
            {children}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center py-12 text-gray-300 border-2 border-dashed border-gray-50 rounded-2xl">
            <Icon className="w-10 h-10 mb-2 opacity-10" />
            <p className="text-xs font-bold tracking-tight uppercase">
              Waiting for Analysis
            </p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="p-8 mx-auto bg-gray-50 min-h-screen relative">
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-40 bg-gray-50/10 backdrop-blur-[6px] flex items-center justify-center">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-8">
              <Brain size={48} className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4 uppercase italic">
              AI Intelligence is Locked
            </h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-6">
              Predictive revenue forecasting, regional strategy, and zero-click
              audit intelligence are exclusive to the{" "}
              <span className="text-indigo-600 font-black italic">GROWTH</span>{" "}
              tier.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <a
                href="/#pricing"
                className="w-full bg-indigo-600 text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
              >
                Upgrade to Growth
                <Rocket className="w-4 h-4" />
              </a>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                Instantly unlocks 14+ AI Intelligence Modules
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={`mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${isLocked ? "pointer-events-none" : ""}`}
      >
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center tracking-tighter">
            <Zap className="mr-3 text-blue-600 fill-blue-600 w-10 h-10" />
            AI Intelligence Hub
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Real-time business strategy generated by{" "}
            <span className="font-bold text-gray-900 border-b-2 border-blue-200">
              Gemini 1.5 Flash
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-gray-200">
            <button
              onClick={() => setLanguage("en")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center ${
                language === "hi"
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Languages className="w-4 h-4 mr-2" />
              Hinglish
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              disabled={isGeneratingAll}
              className={`flex items-center px-8 py-3 rounded-2xl font-black text-sm tracking-wide transition-all ${
                isGeneratingAll
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black active:scale-95 shadow-2xl shadow-gray-200"
              }`}
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="animate-spin mr-3 w-5 h-5" />
                  Generating All...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-3" />
                  Generate Insights
                </>
              )}
            </button>

            {showLangPicker && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 animate-in zoom-in-95 duration-200">
                <p className="text-[10px] font-black uppercase text-gray-400 px-4 py-3 tracking-widest leading-none">
                  Select Strategy Language
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => generateAllInsights("en")}
                    className="w-full text-left px-5 py-4 hover:bg-blue-50 rounded-2xl text-sm font-bold text-gray-800 transition-all flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-3 text-blue-600" />
                    English Report
                  </button>
                  <button
                    onClick={() => generateAllInsights("hi")}
                    className="w-full text-left px-5 py-4 hover:bg-blue-50 rounded-2xl text-sm font-bold text-gray-800 transition-all flex items-center"
                  >
                    <Languages className="w-4 h-4 mr-3 text-blue-600" />
                    Hinglish Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {errors.global && (
        <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-5 mb-8 flex items-center animate-in slide-in-from-top-4">
          <AlertCircle className="text-red-600 w-6 h-6 mr-4" />
          <p className="text-red-800 font-bold">{errors.global}</p>
        </div>
      )}

      {loadingInitial ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
            Hydrating Intelligence...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* 1. SALES FORECAST */}
          <ModuleCard
            title="Revenue Forecast"
            subtitle="30-day AI prediction"
            icon={TrendingUp}
            data={insights.forecast}
            colorClass="blue"
          >
            <div className="space-y-6">
              <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">
                  Expected Revenue
                </p>
                <p className="text-2xl font-black text-blue-900">
                  ₹{insights.forecast?.predictedRevenue?.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50/50 rounded-xl p-3 border border-green-100">
                  <p className="text-[9px] font-bold text-green-700 uppercase mb-1">
                    Growth
                  </p>
                  <p className="text-lg font-black text-green-900">
                    +{insights.forecast?.growthRate}%
                  </p>
                </div>
                <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100">
                  <p className="text-[9px] font-bold text-purple-700 uppercase mb-1">
                    Confidence
                  </p>
                  <p className="text-lg font-black text-purple-900">
                    {insights.forecast?.confidence}%
                  </p>
                </div>
              </div>
            </div>
          </ModuleCard>

          {/* 2. REGIONAL STRATEGY */}
          <ModuleCard
            title="Regional Strategy"
            subtitle="Localized performance"
            icon={Map}
            data={insights.regional}
            colorClass="orange"
          >
            <div className="space-y-3">
              {insights.regional?.topRegions
                ?.slice(0, 2)
                .map((r: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-orange-50/30 border border-orange-100 rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-black text-gray-900">
                        {r.region}
                      </p>
                      <span className="text-[10px] font-bold text-orange-600">
                        +{r.growth}%
                      </span>
                    </div>
                    <p className="text-[10px] text-orange-800 font-medium leading-tight">
                      {r.potential}
                    </p>
                  </div>
                ))}
            </div>
          </ModuleCard>

          {/* 3. PRICE OPTIMIZATION */}
          <ModuleCard
            title="Price Optimization"
            subtitle="Margin maximization"
            icon={DollarSign}
            data={insights.profit}
            colorClass="green"
          >
            <div className="space-y-3">
              {insights.profit?.increasePrice
                ?.slice(0, 2)
                .map((p: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-green-50/30 border border-green-100 rounded-xl"
                  >
                    <p className="text-[11px] font-black text-gray-900  mb-1">
                      {p.productName}
                    </p>
                    <p className="text-[10px] text-green-700 font-bold">
                      Suggested: ₹{p.suggestedPrice}
                    </p>
                  </div>
                ))}
            </div>
          </ModuleCard>

          {/* 4. RISK ASSESSMENT */}
          <ModuleCard
            title="Risk Assessment"
            subtitle="Churn & threat analysis"
            icon={Users}
            data={insights.churn}
            colorClass="red"
          >
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center mb-4">
              <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-1">
                High Risk Customers
              </p>
              <p className="text-3xl font-black text-red-600">
                {insights.churn?.highRiskCustomers?.length || 0}
              </p>
            </div>
            <p className="text-[11px] text-red-800 font-bold text-center leading-tight">
              Revenue at risk: ₹
              {insights.churn?.revenueAtRisk?.toLocaleString()}
            </p>
          </ModuleCard>

          {/* 5. GROWTH OPPORTUNITY */}
          <ModuleCard
            title="Growth Opportunity"
            subtitle="Expansion roadmap"
            icon={Rocket}
            data={insights.growth}
            colorClass="indigo"
          >
            <div className="space-y-2">
              <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">
                New Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {insights.growth?.newCategories
                  ?.slice(0, 3)
                  .map((cat: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-lg border border-indigo-100"
                    >
                      {cat}
                    </span>
                  ))}
              </div>
              <p className="text-[11px] text-gray-600 font-medium leading-tight mt-3">
                {insights.growth?.expansionPlan?.slice(0, 80)}...
              </p>
            </div>
          </ModuleCard>

          {/* 6. CUSTOMER BEHAVIOR */}
          <ModuleCard
            title="Customer Behavior"
            subtitle="Buying psychology"
            icon={Brain}
            data={insights.behavior}
            colorClass="pink"
          >
            <div className="space-y-4">
              <div className="p-3 bg-pink-50/30 border border-pink-100 rounded-xl">
                <p className="text-[10px] font-black text-pink-700 uppercase mb-1">
                  Peak Buying Time
                </p>
                <div className="flex flex-wrap gap-2">
                  {insights.behavior?.peakHours
                    ?.slice(0, 2)
                    .map((h: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs font-black text-pink-900"
                      >
                        {h}
                      </span>
                    ))}
                </div>
              </div>
              <p className="text-[11px] text-pink-800 font-bold italic">
                "{insights.behavior?.loyaltyInsights?.slice(0, 60)}..."
              </p>
            </div>
          </ModuleCard>

          {/* 7. PRODUCT STRATEGY */}
          <ModuleCard
            title="Product Strategy"
            subtitle="SKU-level performance"
            icon={Box}
            data={insights.product}
            colorClass="cyan"
          >
            <div className="space-y-3">
              <p className="text-[10px] font-black text-cyan-700 uppercase mb-2">
                Next Best Sellers
              </p>
              {insights.product?.nextBestSellers
                ?.slice(0, 2)
                .map((p: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center p-2 bg-white border border-cyan-100 rounded-xl"
                  >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 shadow-sm" />
                    <p className="text-[11px] font-bold text-gray-800 ">{p}</p>
                  </div>
                ))}
            </div>
          </ModuleCard>

          {/* 8. MARKETING STRATEGY */}
          <ModuleCard
            title="Marketing Tactics"
            subtitle="Ad spend & campaigns"
            icon={Target}
            data={insights.marketing}
            colorClass="purple"
          >
            <div className="space-y-3">
              {insights.marketing?.campaigns
                ?.slice(0, 2)
                .map((c: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 bg-purple-50/30 border border-purple-100 rounded-xl"
                  >
                    <p className="text-[11px] font-black text-purple-900 mb-1">
                      {c.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-purple-600">
                        {c.channel}
                      </span>
                      <span className="text-[9px] font-black bg-purple-100 px-2 py-0.5 rounded text-purple-700">
                        {c.roi} ROI
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </ModuleCard>
          {/* 9. GEO CITATION TRACKER */}
          <ModuleCard
            title="GEO Citation"
            subtitle="AI Engine Visibility"
            icon={Search}
            data={insights.geo}
            colorClass="blue"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-blue-700 uppercase mb-1">
                    Share of Voice
                  </p>
                  <p className="text-2xl font-black text-blue-900">
                    {insights.geo?.shareOfVoice}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-700 uppercase mb-1">
                    Sentiment
                  </p>
                  <p className="text-lg font-black text-blue-600">
                    {insights.geo?.sentimentScore}%
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-600 font-medium leading-tight">
                {insights.geo?.visibilityGap?.slice(0, 80)}...
              </p>
            </div>
          </ModuleCard>

          {/* 10. ZERO-CLICK READINESS */}
          <ModuleCard
            title="Zero-Click Auditor"
            subtitle="2026 AI Agent Readyness"
            icon={ShieldCheck}
            data={insights.zeroClick}
            colorClass="green"
          >
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-green-700 uppercase">
                  Audit Score
                </span>
                <span className="text-xl font-black text-green-900">
                  {insights.zeroClick?.auditScore}%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                  Missing Metadata
                </p>
                <div className="flex flex-wrap gap-1">
                  {insights.zeroClick?.missingMetadata
                    ?.slice(0, 2)
                    .map((m: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded border border-red-100 uppercase"
                      >
                        {m}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </ModuleCard>

          {/* 11. LOGISTICS RISK */}
          <ModuleCard
            title="Logistics Risk"
            subtitle="Supply chain intelligence"
            icon={Truck}
            data={insights.logistics}
            colorClass="orange"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-orange-700 uppercase">
                  Transit Risk
                </p>
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${insights.logistics?.transitRiskScore}%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-3 bg-white border border-orange-100 rounded-xl">
                <p className="text-[10px] font-black text-gray-900 mb-1">
                  Stock-Out Warning
                </p>
                <p className="text-[11px] text-orange-700 font-bold">
                  {insights.logistics?.stockOutRisks?.[0]?.name || "None"} by{" "}
                  {insights.logistics?.stockOutRisks?.[0]?.estimatedDate ||
                    "N/A"}
                </p>
              </div>
            </div>
          </ModuleCard>

          {/* 12. NLP CONTENT PIPELINE */}
          <ModuleCard
            title="Content Pipeline"
            subtitle="High-converting assets"
            icon={FileText}
            data={insights.content}
            colorClass="purple"
          >
            <div className="space-y-4">
              <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-purple-600 text-[8px] text-white font-black uppercase">
                  Ad Copy
                </div>
                <p className="text-[11px] font-black text-purple-900 mb-1 leading-tight">
                  {insights.content?.adCopy?.headline?.slice(0, 40)}...
                </p>
                <p className="text-[9px] text-purple-700 font-medium line-clamp-2">
                  {insights.content?.adCopy?.body}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-black text-gray-400">STATUS</span>
                <span className="font-black text-green-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> READY
                </span>
              </div>
            </div>
          </ModuleCard>

          {/* 13. REVIEW SENTIMENT */}
          <ModuleCard
            title="Review Sentiment"
            subtitle="Customer emotional triggers"
            icon={MessageSquare}
            data={insights.sentiment}
            colorClass="pink"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-pink-700 uppercase">
                  Overall Sentiment
                </span>
                <span className="text-xl font-black text-pink-900">
                  {insights.sentiment?.overallSentiment}%
                </span>
              </div>
              <div className="flex gap-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${insights.sentiment?.emotionalScore?.positive}%`,
                  }}
                />
                <div
                  className="h-full bg-gray-400"
                  style={{
                    width: `${insights.sentiment?.emotionalScore?.neutral}%`,
                  }}
                />
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${insights.sentiment?.emotionalScore?.negative}%`,
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Top Triggers
                </p>
                <p className="text-[11px] text-gray-700 font-medium italic">
                  "{insights.sentiment?.topTriggers?.[0]}"
                </p>
              </div>
            </div>
          </ModuleCard>

          {/* 14. MARKET BENCHMARKING */}
          <ModuleCard
            title="Market Benchmark"
            subtitle="Industry vs Store Ranking"
            icon={BarChart4}
            data={insights.benchmark}
            colorClass="indigo"
          >
            <div className="space-y-4">
              <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">
                    Market Percentile
                  </p>
                  <p className="text-3xl font-black">
                    Top {100 - (insights.benchmark?.marketPercentile || 0)}%
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <BarChart4 className="w-20 h-20" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">
                    Growth
                  </p>
                  <p className="text-[10px] font-black text-green-600 uppercase">
                    {insights.benchmark?.competitorComparison?.growth}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">
                    Pricing
                  </p>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">
                    {insights.benchmark?.competitorComparison?.pricing}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">
                    Retention
                  </p>
                  <p className="text-[10px] font-black text-blue-600 uppercase">
                    {insights.benchmark?.competitorComparison?.retention}
                  </p>
                </div>
              </div>
            </div>
          </ModuleCard>
        </div>
      )}
    </div>
  );
}
