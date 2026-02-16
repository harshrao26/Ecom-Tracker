import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import Store from "@/lib/db/models/Store";
import AnalyticsData from "@/lib/db/models/AnalyticsData";
import { getSession } from "@/lib/auth";

/**
 * GET /api/admin/subscribers
 * Super Admin endpoint to view all subscribers and their metrics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "super-admin") {
      return NextResponse.json(
        { error: "Unauthorized: Super Admin access required" },
        { status: 403 },
      );
    }

    await connectDB();

    // Fetch all users with their stores
    const users = await User.find({}).lean();

    // Enrich with store count and consumption data
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const stores = await Store.find({ userId: user._id }).lean();

        // Calculate days until renewal
        const daysUntilRenewal = user.subscription.endDate
          ? Math.ceil(
              (new Date(user.subscription.endDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            )
          : null;

        // Get total orders for this user (across all stores)
        const storeIds = stores.map((s) => s._id);
        const analyticsRecords = await AnalyticsData.find({
          storeId: { $in: storeIds },
        }).lean();

        const totalOrders = analyticsRecords.reduce((sum, record) => {
          return sum + (record.orders?.length || 0);
        }, 0);

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.subscription.plan,
          status: user.subscription.status,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate,
          daysUntilRenewal,
          storeCount: stores.length,
          totalOrders,
          limits: user.limits,
          createdAt: user.createdAt,
        };
      }),
    );

    // Calculate global metrics
    const totalSubscribers = users.length;
    const activeSubscribers = users.filter(
      (u) => u.subscription.status === "active",
    ).length;
    const churnedSubscribers = users.filter(
      (u) =>
        u.subscription.status === "expired" ||
        u.subscription.status === "cancelled",
    ).length;

    const planDistribution = users.reduce((acc: any, user) => {
      const plan = user.subscription.plan;
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    // Calculate MRR (Monthly Recurring Revenue)
    const planPricing: any = {
      free: 0,
      starter: 999,
      growth: 2499,
      enterprise: 9999,
    };

    const mrr = users
      .filter((u) => u.subscription.status === "active")
      .reduce((sum, user) => {
        return sum + (planPricing[user.subscription.plan] || 0);
      }, 0);

    return NextResponse.json({
      subscribers: enrichedUsers,
      metrics: {
        totalSubscribers,
        activeSubscribers,
        churnedSubscribers,
        churnRate:
          totalSubscribers > 0
            ? ((churnedSubscribers / totalSubscribers) * 100).toFixed(2)
            : 0,
        mrr,
        planDistribution,
      },
    });
  } catch (error) {
    console.error("❌ Error in admin subscribers API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
