import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import RevenueEvent from "@/lib/db/models/RevenueEvent";
import Store from "@/lib/db/models/Store";
import AnalyticsData from "@/lib/db/models/AnalyticsData";
import { getSession } from "@/lib/auth";

const PLAN_PRICING: Record<string, number> = {
  free: 0,
  starter: 999,
  growth: 2499,
  enterprise: 9999,
};

/**
 * GET /api/admin/metrics
 * Advanced SaaS metrics for Super Admin
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

    // 1. MRR Breakdown
    const mrrBreakdown = await calculateMRRBreakdown();

    // 2. Cohort Analysis
    const cohortAnalysis = await calculateCohortRetention();

    // 3. Customer Health Distribution
    const healthDistribution = await calculateHealthDistribution();

    // 4. LTV:CAC Ratio (placeholder - requires CAC tracking)
    const ltvCacRatio = await calculateLTVCAC();

    // 5. Expansion Opportunities
    const expansionOpportunities = await findExpansionOpportunities();

    // 6. Churn Risk Users
    const churnRiskUsers = await findChurnRiskUsers();

    return NextResponse.json({
      mrrBreakdown,
      cohortAnalysis,
      healthDistribution,
      ltvCacRatio,
      expansionOpportunities,
      churnRiskUsers,
    });
  } catch (error) {
    console.error("❌ Error in admin metrics API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function calculateMRRBreakdown() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const events = await RevenueEvent.find({
    eventDate: { $gte: sixMonthsAgo },
  })
    .sort({ eventDate: 1 })
    .lean();

  const monthlyData: Record<
    string,
    {
      new: number;
      expansion: number;
      contraction: number;
      churn: number;
      net: number;
    }
  > = {};

  events.forEach((event) => {
    const monthKey = event.eventDate.toISOString().substring(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        new: 0,
        expansion: 0,
        contraction: 0,
        churn: 0,
        net: 0,
      };
    }

    switch (event.eventType) {
      case "new":
        monthlyData[monthKey].new += event.amount;
        break;
      case "expansion":
        monthlyData[monthKey].expansion += event.amount;
        break;
      case "contraction":
        monthlyData[monthKey].contraction += event.amount;
        break;
      case "churn":
        monthlyData[monthKey].churn += event.amount;
        break;
    }
  });

  // Calculate net MRR
  Object.keys(monthlyData).forEach((month) => {
    const data = monthlyData[month];
    data.net = data.new + data.expansion - data.contraction - data.churn;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
  }));
}

async function calculateCohortRetention() {
  const users = await User.find({}).lean();

  const cohorts: Record<
    string,
    {
      signupCount: number;
      retention30: number;
      retention60: number;
      retention90: number;
      currentMRR: number;
    }
  > = {};

  users.forEach((user) => {
    const cohortKey = user.cohortMonth;
    if (!cohorts[cohortKey]) {
      cohorts[cohortKey] = {
        signupCount: 0,
        retention30: 0,
        retention60: 0,
        retention90: 0,
        currentMRR: 0,
      };
    }

    cohorts[cohortKey].signupCount++;

    const now = new Date();
    const signupDate = new Date(user.createdAt);
    const daysSinceSignup = Math.floor(
      (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Check if user is still active (not churned)
    const isActive = user.subscription.status === "active";

    if (daysSinceSignup >= 30 && isActive) cohorts[cohortKey].retention30++;
    if (daysSinceSignup >= 60 && isActive) cohorts[cohortKey].retention60++;
    if (daysSinceSignup >= 90 && isActive) cohorts[cohortKey].retention90++;

    if (isActive) {
      cohorts[cohortKey].currentMRR +=
        PLAN_PRICING[user.subscription.plan] || 0;
    }
  });

  return Object.entries(cohorts)
    .map(([month, data]) => ({
      month,
      signupCount: data.signupCount,
      retention30:
        data.signupCount > 0
          ? Math.round((data.retention30 / data.signupCount) * 100)
          : 0,
      retention60:
        data.signupCount > 0
          ? Math.round((data.retention60 / data.signupCount) * 100)
          : 0,
      retention90:
        data.signupCount > 0
          ? Math.round((data.retention90 / data.signupCount) * 100)
          : 0,
      currentMRR: data.currentMRR,
    }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 6);
}

async function calculateHealthDistribution() {
  const users = await User.find({ "subscription.status": "active" }).lean();

  const distribution = {
    healthy: 0,
    medium: 0,
    atRisk: 0,
  };

  users.forEach((user) => {
    const score = user.healthScore || 50;
    if (score >= 70) distribution.healthy++;
    else if (score >= 40) distribution.medium++;
    else distribution.atRisk++;
  });

  return distribution;
}

async function calculateLTVCAC() {
  const activeUsers = await User.find({
    "subscription.status": "active",
  }).lean();

  // Calculate average LTV
  const avgMonthlyRevenue =
    activeUsers.reduce(
      (sum, user) => sum + (PLAN_PRICING[user.subscription.plan] || 0),
      0,
    ) / (activeUsers.length || 1);

  // Assume average customer lifespan of 12 months (placeholder)
  const avgLTV = avgMonthlyRevenue * 12;

  // Placeholder CAC (should be tracked separately)
  const avgCAC = 2000; // ₹2000 per customer

  return {
    avgLTV: Math.round(avgLTV),
    avgCAC,
    ratio: avgCAC > 0 ? (avgLTV / avgCAC).toFixed(2) : "N/A",
  };
}

async function findExpansionOpportunities() {
  const opportunities = [];

  // 1. Free users with high usage
  const freeUsers = await User.find({
    "subscription.plan": "free",
    "subscription.status": "active",
  }).lean();

  for (const user of freeUsers) {
    const stores = await Store.find({ userId: user._id }).lean();
    const storeIds = stores.map((s) => s._id);
    const analyticsRecords = await AnalyticsData.find({
      storeId: { $in: storeIds },
    }).lean();

    const totalOrders = analyticsRecords.reduce(
      (sum, record) => sum + (record.orders?.length || 0),
      0,
    );

    if (totalOrders > 500) {
      opportunities.push({
        userId: user._id,
        email: user.email,
        name: user.name,
        currentPlan: "free",
        suggestedPlan: "starter",
        reason: `High usage: ${totalOrders} orders (limit: 100)`,
        potentialMRR: 999,
      });
    }
  }

  // 2. Starter users with multiple stores
  const starterUsers = await User.find({
    "subscription.plan": "starter",
    "subscription.status": "active",
  }).lean();

  for (const user of starterUsers) {
    const storeCount = await Store.countDocuments({ userId: user._id });
    if (storeCount >= 2) {
      opportunities.push({
        userId: user._id,
        email: user.email,
        name: user.name,
        currentPlan: "starter",
        suggestedPlan: "growth",
        reason: `${storeCount} stores connected (limit: 2)`,
        potentialMRR: 1500, // 2499 - 999
      });
    }
  }

  return opportunities.slice(0, 10);
}

async function findChurnRiskUsers() {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const atRiskUsers = await User.find({
    "subscription.status": "active",
    $or: [
      { lastLoginAt: { $lt: fourteenDaysAgo } },
      { lastLoginAt: { $exists: false } },
      { healthScore: { $lt: 40 } },
    ],
  })
    .limit(10)
    .lean();

  return atRiskUsers.map((user) => ({
    userId: user._id,
    email: user.email,
    name: user.name,
    plan: user.subscription.plan,
    healthScore: user.healthScore || 0,
    lastLogin: user.lastLoginAt || user.createdAt,
    daysSinceLogin: user.lastLoginAt
      ? Math.floor(
          (now.getTime() - new Date(user.lastLoginAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : "Never",
    riskLevel: (user.healthScore || 0) < 30 ? "high" : "medium",
  }));
}
