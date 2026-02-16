import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import Order from "@/lib/db/models/Order";
import Subscription from "@/lib/db/models/Subscription";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get completed orders for revenue calculation
    const completedOrders = await Order.find({
      status: "completed",
      createdAt: { $gte: startDate },
    }).lean();

    const allCompletedOrders = await Order.find({
      status: "completed",
    }).lean();

    // Calculate total revenue
    const totalRevenue = allCompletedOrders.reduce(
      (sum, order) => sum + order.amount,
      0,
    );

    const periodRevenue = completedOrders.reduce(
      (sum, order) => sum + order.amount,
      0,
    );

    // Calculate previous period revenue for growth
    const prevStartDate = new Date(
      startDate.getTime() - (now.getTime() - startDate.getTime()),
    );
    const prevOrders = await Order.find({
      status: "completed",
      createdAt: { $gte: prevStartDate, $lt: startDate },
    }).lean();
    const prevPeriodRevenue = prevOrders.reduce(
      (sum, order) => sum + order.amount,
      0,
    );

    const growth =
      prevPeriodRevenue > 0
        ? ((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100
        : 0;

    // Calculate MRR and ARR from active subscriptions
    const activeSubscriptions = await Subscription.find({
      status: "active",
    }).lean();

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === "monthly") {
        return sum + sub.amount;
      } else if (sub.billingCycle === "yearly") {
        return sum + sub.amount / 12;
      } else if (sub.billingCycle === "quarterly") {
        return sum + sub.amount / 3;
      }
      return sum;
    }, 0);

    const arr = mrr * 12;

    // Calculate average order value
    const avgOrderValue =
      completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => sum + order.amount, 0) /
          completedOrders.length
        : 0;

    // Revenue over time (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: {
            $gte: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const revenueOverTime = monthlyRevenue.map((item) => {
      const [year, month] = item._id.split("-");
      return {
        month: monthNames[parseInt(month) - 1],
        revenue: item.revenue,
        transactions: item.transactions,
      };
    });

    // Revenue by plan
    const revenueByPlan = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$plan",
          revenue: { $sum: "$amount" },
          customers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          plan: "$_id",
          revenue: 1,
          customers: { $size: "$customers" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const planDistribution = revenueByPlan.map((item) => ({
      plan: item.plan,
      revenue: item.revenue,
      customers: item.customers,
    }));

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$amount" },
          orderCount: { $sum: 1 },
          customerName: { $first: "$customerName" },
          customerEmail: { $first: "$customerEmail" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    const topCustomersList = topCustomers.map((item) => ({
      id: item._id.toString(),
      name: item.customerName,
      email: item.customerEmail,
      totalSpent: item.totalSpent,
      orderCount: item.orderCount,
    }));

    // Recent transactions
    const recentTransactions = await Order.find()
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    const recentTransactionsList = recentTransactions.map((order) => ({
      id: order._id.toString(),
      customerName: order.customerName,
      amount: order.amount,
      plan: order.plan,
      date: order.createdAt.toISOString(),
      status: order.status,
    }));

    const responseData = {
      summary: {
        totalRevenue: Math.round(totalRevenue),
        mrr: Math.round(mrr),
        arr: Math.round(arr),
        growth: parseFloat(growth.toFixed(1)),
        avgOrderValue: Math.round(avgOrderValue),
        totalTransactions: completedOrders.length,
      },
      revenueOverTime:
        revenueOverTime.length > 0
          ? revenueOverTime
          : [{ month: "No Data", revenue: 0, transactions: 0 }],
      revenueByPlan:
        planDistribution.length > 0
          ? planDistribution
          : [{ plan: "No Data", revenue: 0, customers: 0 }],
      topCustomers: topCustomersList.length > 0 ? topCustomersList : [],
      recentTransactions:
        recentTransactionsList.length > 0 ? recentTransactionsList : [],
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch revenue data" },
      { status: 500 },
    );
  }
}
