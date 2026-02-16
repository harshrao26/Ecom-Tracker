import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AnalyticsAggregator from "@/lib/analytics/aggregator";
import { insightsGenerator } from "@/lib/ai/insights-generator";
import AnalyticsCache from "@/lib/analytics/cache";
import Insight from "@/lib/db/models/Insight";
import User from "@/lib/db/models/User";
import { getSession } from "@/lib/auth";

/**
 * POST /api/ai/insights
 * Main AI insights API endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // STEP 1: PARSE REQUEST BODY
    const body = await request.json();
    console.log("📥 AI Insight Request Body:", body);
    const { insightType, storeId, language = "en" } = body;

    // STEP 2: VALIDATE INPUT
    const validTypes = [
      "forecast",
      "profit",
      "churn",
      "marketing",
      "regional",
      "growth",
      "behavior",
      "product",
      "geo",
      "zeroClick",
      "logistics",
      "content",
      "sentiment",
      "benchmark",
      "all",
    ];
    if (!validTypes.includes(insightType)) {
      return NextResponse.json(
        {
          error:
            "Invalid insight type. Must be: forecast, profit, churn, marketing, regional, growth, behavior, product, geo, zeroClick, logistics, content, sentiment, benchmark, or all",
        },
        { status: 400 },
      );
    }

    // STEP 2.5: AUTH & GATING
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.userId;

    await connectDB();
    const user = await User.findById(userId);
    if (!user?.limits?.aiInsights) {
      return NextResponse.json(
        {
          error:
            "AI Insights is a premium feature. Upgrade to Growth plan to unlock.",
        },
        { status: 403 },
      );
    }

    console.log(`🤖 Generating ${insightType} insight for store ${storeId}`);

    // STEP 3: CHECK CACHE (24 hour TTL for AI insights)
    const cacheKey = `ai:${insightType}:${storeId}`;
    const cached = AnalyticsCache.get(cacheKey);

    if (cached) {
      console.log("✅ Returning cached AI insight");
      return NextResponse.json({
        success: true,
        data: cached,
        insights: cached.legacyFormat, // For backward compatibility
        cached: true,
        generatedAt: cached.timestamp,
      });
    }

    // STEP 4: CONNECT TO DATABASE
    await connectDB();

    // STEP 5: GENERATE INSIGHTS
    let result: any = {};
    const startTime = Date.now();

    if (insightType === "all") {
      const [f, p, c, m, r, g, b, prod, geo, zc, log, sent, bench] =
        await Promise.all([
          fetchDataForInsight("forecast", userId, storeId).then((d) =>
            insightsGenerator.generateSalesForecast(d as any, language),
          ),
          fetchDataForInsight("profit", userId, storeId).then((d) =>
            insightsGenerator.suggestProfitOptimization(d as any, language),
          ),
          fetchDataForInsight("churn", userId, storeId).then((d) =>
            insightsGenerator.predictChurn(d as any, language),
          ),
          fetchDataForInsight("marketing", userId, storeId).then((d) =>
            insightsGenerator.generateMarketingStrategy(d as any, language),
          ),
          fetchDataForInsight("regional", userId, storeId).then((d) =>
            insightsGenerator.generateRegionalStrategy(d as any, language),
          ),
          fetchDataForInsight("growth", userId, storeId).then((d) =>
            insightsGenerator.generateGrowthOpportunities(d as any, language),
          ),
          fetchDataForInsight("behavior", userId, storeId).then((d) =>
            insightsGenerator.analyzeCustomerBehavior(d as any, language),
          ),
          fetchDataForInsight("product", userId, storeId).then((d) =>
            insightsGenerator.generateProductStrategy(d as any, language),
          ),
          fetchDataForInsight("geo", userId, storeId).then((d) =>
            insightsGenerator.generateGEOCitation(d as any, language),
          ),
          fetchDataForInsight("zeroClick", userId, storeId).then((d) =>
            insightsGenerator.analyzeZeroClickReadiness(d as any, language),
          ),
          fetchDataForInsight("logistics", userId, storeId).then((d) =>
            insightsGenerator.analyzeSupplyChainLogistics(d as any, language),
          ),
          fetchDataForInsight("sentiment", userId, storeId).then((d) =>
            insightsGenerator.analyzeSentimentTrends(d as any, language),
          ),
          fetchDataForInsight("benchmark", userId, storeId).then((d) =>
            insightsGenerator.generateMarketBenchmarking(d as any, language),
          ),
        ]);

      // Generate content pipeline based on marketing results
      const content = await insightsGenerator.generateAutomatedNLPContent(
        m,
        language,
      );

      result = {
        forecast: f,
        profit: p,
        churn: c,
        marketing: m,
        regional: r,
        growth: g,
        behavior: b,
        product: prod,
        geo: geo,
        zeroClick: zc,
        logistics: log,
        content: content,
        sentiment: sent,
        benchmark: bench,
        legacyFormat: {
          salesForecast: convertToMarkdown("forecast", f),
          pricingOptimization: convertToMarkdown("profit", p),
          churnPrediction: convertToMarkdown("churn", c),
          performanceReport: convertToMarkdown("marketing", m),
          regionalStrategy: convertToMarkdown("regional", r),
          growthOpportunities: convertToMarkdown("growth", g),
          customerBehavior: convertToMarkdown("behavior", b),
          productStrategy: convertToMarkdown("product", prod),
          geoCitation: convertToMarkdown("geo", geo),
          zeroClick: convertToMarkdown("zeroClick", zc),
          logistics: convertToMarkdown("logistics", log),
          nlpContent: convertToMarkdown("content", content),
          sentiment: convertToMarkdown("sentiment", sent),
          benchmark: convertToMarkdown("benchmark", bench),
        },
      };

      // Save all 14 individually for persistence on refresh
      const types = [
        "forecast",
        "profit",
        "churn",
        "marketing",
        "regional",
        "growth",
        "behavior",
        "product",
        "geo",
        "zeroClick",
        "logistics",
        "content",
        "sentiment",
        "benchmark",
      ];
      const results = [
        f,
        p,
        c,
        m,
        r,
        g,
        b,
        prod,
        geo,
        zc,
        log,
        content,
        sent,
        bench,
      ];

      await Promise.all(
        types.map((type, i) =>
          Insight.findOneAndUpdate(
            { userId, storeId, type, language },
            {
              content: results[i],
              legacyFormat: { [type]: convertToMarkdown(type, results[i]) },
              metadata: {
                generationTime: Date.now() - startTime,
                model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
                timestamp: new Date(),
              },
            },
            { upsert: true },
          ),
        ),
      );
    } else {
      const data = await fetchDataForInsight(insightType, userId, storeId);
      let insight;

      switch (insightType) {
        case "forecast":
          insight = await insightsGenerator.generateSalesForecast(
            data as any,
            language,
          );
          break;
        case "profit":
          insight = await insightsGenerator.suggestProfitOptimization(
            data as any,
            language,
          );
          break;
        case "churn":
          insight = await insightsGenerator.predictChurn(data as any, language);
          break;
        case "marketing":
          insight = await insightsGenerator.generateMarketingStrategy(
            data as any,
            language,
          );
          break;
        case "regional":
          insight = await insightsGenerator.generateRegionalStrategy(
            data as any,
            language,
          );
          break;
        case "growth":
          insight = await insightsGenerator.generateGrowthOpportunities(
            data as any,
            language,
          );
          break;
        case "behavior":
          insight = await insightsGenerator.analyzeCustomerBehavior(
            data as any,
            language,
          );
          break;
        case "content":
          // For content, we might need marketing data first, but let's try with general analytics for standalone call
          const mData = await fetchDataForInsight("marketing", userId, storeId);
          insight = await insightsGenerator.generateAutomatedNLPContent(
            mData as any,
            language,
          );
          break;
        case "geo":
          insight = await insightsGenerator.generateGEOCitation(
            data as any,
            language,
          );
          break;
        case "zeroClick":
          insight = await insightsGenerator.analyzeZeroClickReadiness(
            data as any,
            language,
          );
          break;
        case "logistics":
          insight = await insightsGenerator.analyzeSupplyChainLogistics(
            data as any,
            language,
          );
          break;
        case "sentiment":
          insight = await insightsGenerator.analyzeSentimentTrends(
            data as any,
            language,
          );
          break;
        case "benchmark":
          insight = await insightsGenerator.generateMarketBenchmarking(
            data as any,
            language,
          );
          break;
      }
      result = insight;
      result.legacyFormat = {
        [insightType]: convertToMarkdown(insightType, insight),
      };
    }

    const endTime = Date.now();
    const generationTime = endTime - startTime;

    // STEP 6: SAVE TO DATABASE (UPSERT)
    const responseData = {
      ...result,
      timestamp: new Date().toISOString(),
      generationTime,
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    };

    try {
      await Insight.findOneAndUpdate(
        { userId, storeId, type: insightType, language },
        {
          content: result,
          legacyFormat: result.legacyFormat,
          metadata: {
            generationTime,
            model: responseData.model,
            timestamp: new Date(),
          },
        },
        { upsert: true, new: true },
      );
      console.log(`✅ Saved ${insightType} insight to DB`);
    } catch (dbError) {
      console.error("⚠️ Failed to save insight to DB:", dbError);
    }

    // STEP 7: CACHE RESULT (24 hours)
    AnalyticsCache.set(cacheKey, responseData, 86400);

    // STEP 8: RETURN RESPONSE
    return NextResponse.json({
      success: true,
      data: responseData,
      insights: responseData.legacyFormat,
      cached: false,
      generatedAt: responseData.timestamp,
    });
  } catch (error) {
    console.error("❌ AI Insight Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate insight",
      },
      { status: 500 },
    );
  }
}

/**
 * Helper to convert structured JSON to Markdown for legacy components
 */
function convertToMarkdown(type: string, data: any): string {
  if (!data) return "No data available.";

  switch (type) {
    case "forecast":
      return `### 📈 Sales Forecast
**Predicted Revenue:** ₹${data.predictedRevenue.toLocaleString()}
**Growth Rate:** +${data.growthRate}%
**Confidence:** ${data.confidence}%

**Key Patterns:**
${data.seasonalPatterns.map((p: string) => `- ${p}`).join("\n")}

**Peak Days:** ${data.peakDays.join(", ")}`;

    case "profit":
      return `### 💰 Profit Optimization
**Top Opportunities:**
${data.increasePrice
  ?.slice(0, 3)
  .map(
    (p: any) =>
      `- **${p.productName}**: Increase price to ₹${p.suggestedPrice} (${p.reason})`,
  )
  .join("\n")}

**Discount Strategies:**
${data.applyDiscounts
  ?.slice(0, 2)
  .map((p: any) => `- **${p.productName}**: ${p.reason}`)
  .join("\n")}`;

    case "churn":
      return `### 👥 Churn Prediction
**At-Risk Customers:** ${data.highRiskCustomers?.length || 0}
**Retention Strategies:**
${data.retentionStrategies?.map((s: string) => `- ${s}`).join("\n")}`;

    case "marketing":
      return `### 🎯 Marketing Strategy
**Recommended Campaigns:**
${data.campaigns?.map((c: any) => `- **${c.name}** (${c.channel}): Budget ₹${c.budget}, Expected ROI: ${c.roi}`).join("\n")}`;

    case "regional":
      return `### 🗺️ Regional Strategy
**Top Regions:** ${data.topRegions?.map((r: any) => r.region).join(", ")}
**Key Insights:** ${data.logisticsInsights?.join(". ")}`;

    case "growth":
      return `### 🚀 Growth Opportunities
**New Categories:** ${data.newCategories?.join(", ")}
**Expansion Plan:** ${data.expansionPlan}`;

    case "behavior":
      return `### 🧠 Customer Behavior
**Buying Cycles:** ${data.buyingCycles}
**Peak Hours:** ${data.peakHours?.join(", ")}`;

    case "product":
      return `### 📦 Product Strategy
**Hero Products:** ${data.heroProducts?.join(", ")}
**Bundling Ideas:** ${data.bundlingIdeas?.join(", ")}`;

    case "geo":
      return `### 🌐 GEO Citation Tracker
**Share of Voice:** ${data.shareOfVoice}%
**Sentiment Score:** ${data.sentimentScore}%
**Top Citation:** ${data.topCitations?.[0]?.platform || "AI Overviews"}`;

    case "zeroClick":
      return `### 🤖 Zero-Click Readiness
**Audit Score:** ${data.auditScore}%
**Agent Accessibility:** ${data.agentAccessibility}`;

    case "logistics":
      return `### 📦 Logistics Intelligence
**Transit Risk Score:** ${data.transitRiskScore}%
**Stock Risks:** ${data.stockOutRisks?.[0]?.name || "None identified"}`;

    case "content":
      return `### ✍️ NLP Content Pipeline
**Headline:** ${data.adCopy?.headline}
**Marketing Phase:** ${data.marketingPhase}`;

    case "sentiment":
      return `### 💬 Review Sentiment
**Overall Sentiment:** ${data.overallSentiment}%
**Key Triggers:** ${data.topTriggers?.join(", ")}`;

    case "benchmark":
      return `### 📊 Market Benchmark
**Market Percentile:** ${data.marketPercentile}th
**Strategic Advantage:** ${data.strategicAdvantage}`;

    default:
      return "Detailed insights available in the premium AI dashboard.";
  }
}

/**
 * Fetch data required for specific insight type
 */
async function fetchDataForInsight(
  type: string,
  userId: string,
  storeId: string,
) {
  const endDate = new Date().toISOString().split("T")[0];

  // Set startDate to 10 years ago to essentially cover "all time" for the seller
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 10);
  const startDateStr = startDate.toISOString().split("T")[0];

  switch (type) {
    case "forecast":
      const trends = await AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: startDateStr,
        endDate,
      });

      // Group by day for the AI
      const grouped = new Map();

      trends.orders.forEach((order: any) => {
        const date = new Date(order.date).toISOString().split("T")[0];
        if (!grouped.has(date)) {
          grouped.set(date, { date, revenue: 0, orders: 0 });
        }
        const g = grouped.get(date);
        g.revenue += order.total;
        g.orders += 1;
      });

      return {
        dailyRevenue: Array.from(grouped.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
        period: "full_history",
      };

    case "profit":
      const productData = await AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: startDateStr,
        endDate,
      });

      // Use engine to get aggregated product performance
      const { AnalyticsEngine } = await import("@/lib/analytics/engine");
      return AnalyticsEngine.calculateSKUProfitability(
        productData.products,
      ).map((p: any) => ({
        id: p.productId,
        name: p.name,
        category: p.category,
        price: p.avgSellingPrice,
        cost: p.costPerUnit,
        unitsSold: p.units,
        revenue: p.revenue,
        margin: p.profitMargin,
      }));

    case "churn":
      const customerData = await AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: startDateStr,
        endDate,
      });

      return customerData.customers.map((c: any) => ({
        id: c.customerId,
        name: c.name || "Customer",
        email: c.email,
        lastPurchase: c.lastOrderDate,
        lifetimeValue: c.totalSpent,
        orderCount: c.totalOrders,
        avgOrderValue: c.totalSpent / c.totalOrders,
        city: c.city,
      }));

    case "marketing":
    case "regional":
    case "growth":
    case "behavior":
    case "geo":
    case "zeroClick":
    case "logistics":
    case "content":
    case "sentiment":
    case "benchmark":
      const fullData = await AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: startDateStr,
        endDate,
      });

      const engine = (await import("@/lib/analytics/engine")).default;
      const analyticsResult = {
        customerSegments: engine.segmentCustomers(fullData.customers),
        regionalData: engine.analyzeByRegion(fullData.orders),
        topProducts: engine.getTopProducts(fullData.products, 10),
        codAnalysis: engine.analyzeCOD(fullData.orders),
      };

      if (type === "marketing") return analyticsResult;
      if (type === "regional") return analyticsResult.regionalData;
      if (type === "growth") return analyticsResult;
      if (type === "behavior") return fullData.customers;
      return analyticsResult;

    case "product":
      return await AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: startDateStr,
        endDate,
      });

    default:
      throw new Error(`Unsupported insight type: ${type}`);
  }
}

/**
 * GET /api/ai/insights
 * Fetch saved insights for a user/store
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId") || "all";
    const language = (searchParams.get("language") as "en" | "hi") || "en";

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.userId;

    await connectDB();

    const savedInsights = await Insight.find({ userId, storeId, language });

    return NextResponse.json({
      success: true,
      data: savedInsights,
      availableInsights: [
        { type: "forecast", name: "Sales Forecast" },
        { type: "profit", name: "Profit Optimization" },
        { type: "churn", name: "Risk Assessment" },
        { type: "marketing", name: "Marketing Strategy" },
        { type: "regional", name: "Regional Strategy" },
        { type: "growth", name: "Growth Opportunity" },
        { type: "behavior", name: "Customer Behavior" },
        { type: "product", name: "Product Strategy" },
        { type: "geo", name: "GEO Citation" },
        { type: "zeroClick", name: "Zero-Click Readiness" },
        { type: "logistics", name: "Logistics Risk" },
        { type: "content", name: "Content Pipeline" },
        { type: "sentiment", name: "Sentiment Trends" },
        { type: "benchmark", name: "Market Benchmark" },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch insights" },
      { status: 500 },
    );
  }
}
