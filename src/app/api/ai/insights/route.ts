import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AnalyticsAggregator from "@/lib/analytics/aggregator";
import AnalyticsEngine from "@/lib/analytics/engine";
import GeminiAIClient from "@/lib/ai/gemini-client";
import { calculateDateRange } from "@/lib/utils/analytics";

/**
 * POST /api/ai/insights
 * Generate AI-powered insights for analytics data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      storeId = "all",
      period = "30d",
      insightType = "all",
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Fetch analytics data
    const dateRange = calculateDateRange(period);
    const rawData = await AnalyticsAggregator.fetchAnalyticsData({
      userId,
      storeId,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

    // Process data
    const analytics = {
      overview: AnalyticsEngine.calculateOverview(rawData.orders),
      topProducts: AnalyticsEngine.getTopProducts(rawData.products, 10),
      regionalData: AnalyticsEngine.analyzeByRegion(rawData.orders),
      customerSegments: AnalyticsEngine.segmentCustomers(rawData.customers),
      codAnalysis: AnalyticsEngine.analyzeCOD(rawData.orders),
      profitAnalysis: AnalyticsEngine.calculateSKUProfitability(
        rawData.products,
      ),
    };

    // Initialize Gemini client
    const aiClient = new GeminiAIClient();

    // Generate insights based on type
    let insights: any = {};

    if (insightType === "all" || insightType === "forecast") {
      console.log("📊 Generating sales forecast...");
      insights.salesForecast = await aiClient.generateSalesForecast({
        historicalRevenue: analytics.overview.totalRevenue
          ? [analytics.overview.totalRevenue]
          : [],
        currentRevenue: analytics.overview.totalRevenue || 0,
        growthRate: analytics.overview.revenueGrowth || 0,
        topProducts: analytics.topProducts,
      });
    }

    if (insightType === "all" || insightType === "inventory") {
      console.log("📦 Generating inventory insights...");
      insights.inventoryOptimization = await aiClient.generateInventoryInsights(
        {
          products: rawData.products.map((p) => ({
            name: p.name,
            stock: p.currentStock || p.stock || 0,
            unitsSold: p.totalUnits || 0,
            revenue: p.totalRevenue || 0,
          })),
          totalRevenue: analytics.overview.totalRevenue || 0,
        },
      );
    }

    if (insightType === "all" || insightType === "pricing") {
      console.log("💰 Generating pricing insights...");
      insights.pricingOptimization = await aiClient.generatePricingInsights({
        products: analytics.profitAnalysis.map((p) => ({
          name: p.name,
          price: p.avgSellingPrice || 0,
          cost: p.costPerUnit || 0,
          profitMargin: p.profitMargin || 0,
          revenue: p.revenue || 0,
        })),
        avgMargin: analytics.overview.profitMargin || 0,
      });
    }

    if (insightType === "all" || insightType === "churn") {
      console.log("👥 Generating churn prediction...");
      insights.churnPrediction = await aiClient.generateChurnPrediction({
        customerSegments: {
          vip: analytics.customerSegments.vip || 0,
          regular: analytics.customerSegments.regular || 0,
          atRisk: analytics.customerSegments.atRisk || 0,
          churned: analytics.customerSegments.churned || 0,
        },
        vipCustomers: analytics.customerSegments.vipCustomers || [],
        atRiskCustomers: analytics.customerSegments.atRiskCustomers || [],
      });
    }

    if (insightType === "all" || insightType === "report") {
      console.log("📋 Generating performance report...");
      insights.performanceReport = await aiClient.generatePerformanceReport({
        overview: analytics.overview,
        topProducts: analytics.topProducts,
        regionalData: analytics.regionalData,
        customerSegments: analytics.customerSegments,
        codAnalysis: analytics.codAnalysis,
        period,
      });
    }

    if (insightType === "all" || insightType === "india") {
      console.log("🇮🇳 Generating India-specific insights...");
      insights.indiaInsights = await aiClient.generateIndiaSpecificInsights({
        codAnalysis: analytics.codAnalysis,
        regionalData: analytics.regionalData,
      });
    }

    return NextResponse.json({
      success: true,
      insights,
      period,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error generating AI insights:", error);

    return NextResponse.json(
      {
        error: "Failed to generate insights",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/insights
 * Get available insight types
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    availableInsights: [
      {
        type: "forecast",
        name: "Sales Forecast",
        description: "30-day revenue prediction with growth factors",
      },
      {
        type: "inventory",
        name: "Inventory Optimization",
        description: "Stock alerts, restocking priorities, overstock clearance",
      },
      {
        type: "pricing",
        name: "Pricing Optimization",
        description: "Price increase opportunities, discount strategies",
      },
      {
        type: "churn",
        name: "Churn Prediction",
        description: "At-risk customers, retention strategies",
      },
      {
        type: "report",
        name: "Performance Report",
        description: "Comprehensive weekly/monthly summary",
      },
      {
        type: "india",
        name: "India-Specific Insights",
        description: "COD optimization, regional expansion, tier 2/3 cities",
      },
      {
        type: "all",
        name: "All Insights",
        description: "Generate all insights at once",
      },
    ],
    usage: {
      endpoint: "POST /api/ai/insights",
      params: {
        userId: "required",
        storeId: "optional (default: all)",
        period: "optional (default: 30d)",
        insightType: "optional (default: all)",
      },
    },
  });
}
