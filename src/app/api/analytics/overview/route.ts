import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AnalyticsAggregator from "@/lib/analytics/aggregator";
import AnalyticsEngine from "@/lib/analytics/engine";
import AnalyticsCache from "@/lib/analytics/cache";
import { calculateDateRange } from "@/lib/utils/analytics";

/**
 * GET /api/analytics/overview
 * Main analytics API endpoint
 *
 * Query params:
 * - userId: User ID (required)
 * - period: Time period (7d, 30d, 90d, 1y) - default: 7d
 * - storeId: Store ID or 'all' - default: all
 */
export async function GET(request: NextRequest) {
  try {
    // STEP 1: PARSE QUERY PARAMETERS
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "7d";
    const storeId = searchParams.get("storeId") || "all";

    // STEP 2: VALIDATE INPUT
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Validate period
    const validPeriods = [
      "7d",
      "30d",
      "90d",
      "1y",
      "today",
      "yesterday",
      "mtd",
      "ytd",
    ];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Must be one of: " + validPeriods.join(", ") },
        { status: 400 },
      );
    }

    // STEP 3: CHECK CACHE
    const cacheKey = AnalyticsCache.generateKey(userId, { period, storeId });
    const cachedData = AnalyticsCache.get(cacheKey);

    if (cachedData) {
      console.log("✅ Cache hit for", cacheKey);
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    console.log("❌ Cache miss for", cacheKey);

    // STEP 4: CONNECT TO DATABASE
    await connectDB();

    // STEP 5: CALCULATE DATE RANGE
    const dateRange = calculateDateRange(period);
    console.log("📅 Date range:", dateRange);

    // Also calculate previous period for growth comparison
    const periodDays = Math.ceil(
      (new Date(dateRange.end).getTime() -
        new Date(dateRange.start).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const previousStart = new Date(dateRange.start);
    previousStart.setDate(previousStart.getDate() - periodDays);
    const previousEnd = new Date(dateRange.start);
    previousEnd.setDate(previousEnd.getDate() - 1);

    // STEP 6: FETCH RAW DATA FROM DATABASE
    const [currentData, previousData] = await Promise.all([
      AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: dateRange.start,
        endDate: dateRange.end,
      }),
      AnalyticsAggregator.fetchAnalyticsData({
        userId,
        storeId,
        startDate: previousStart.toISOString().split("T")[0],
        endDate: previousEnd.toISOString().split("T")[0],
      }),
    ]);

    console.log(`📊 Fetched ${currentData.orders.length} orders`);

    // STEP 7: PROCESS DATA WITH ANALYTICS ENGINE
    const processedData = {
      overview: AnalyticsEngine.calculateOverview(
        currentData.orders,
        previousData.orders,
      ),
      dailyTrend: AnalyticsEngine.groupByPeriod(currentData.orders, "day"),
      regionalData: AnalyticsEngine.analyzeByRegion(currentData.orders),
      topProducts: AnalyticsEngine.getTopProducts(currentData.products, 10),
      customerSegments: AnalyticsEngine.segmentCustomers(currentData.customers),
      orderStatus: AnalyticsEngine.analyzeOrderStatus(currentData.orders),
      profitAnalysis: AnalyticsEngine.calculateSKUProfitability(
        currentData.products,
      ),
      codAnalysis: AnalyticsEngine.analyzeCOD(currentData.orders),
      inventoryHealth: AnalyticsEngine.analyzeInventoryHealth(
        currentData.products,
      ),
      categoryDistribution: AnalyticsEngine.analyzeCategories(
        currentData.products,
      ),
      stateData: AnalyticsEngine.analyzeByState(currentData.orders),
      priceRangeDistribution: AnalyticsEngine.analyzePriceRanges(
        currentData.products,
      ),
      discountEffectiveness: AnalyticsEngine.analyzeDiscountEffectiveness(
        currentData.orders,
      ),
      pricingStrategy: AnalyticsEngine.generatePricingStrategy(
        currentData.products,
      ),
      customerPurchaseFrequency:
        AnalyticsEngine.analyzeCustomerPurchaseFrequency(currentData.customers),
      topCustomers: AnalyticsEngine.calculateTopCustomers(
        currentData.customers,
      ),

      // Metadata
      period,
      dateRange,
      fetchedAt: new Date().toISOString(),
    };

    // STEP 8: CACHE RESULT (5 minutes TTL)
    AnalyticsCache.set(cacheKey, processedData, 300);

    // STEP 9: RETURN RESPONSE
    return NextResponse.json({
      ...processedData,
      cached: false,
    });
  } catch (error) {
    console.error("❌ Error in analytics API:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/analytics/overview
 * Clear cache for specific user/store
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body;

    if (action === "clear-cache") {
      // Clear all cache for this user
      AnalyticsCache.clear();

      return NextResponse.json({
        success: true,
        message: "Cache cleared successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error in analytics API:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
