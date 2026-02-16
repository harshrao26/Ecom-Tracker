import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import Session from "@/lib/db/models/Session";
import Order from "@/lib/db/models/Order";
import Subscription from "@/lib/db/models/Subscription";
import { ExportColumn } from "@/lib/utils/exportCSV";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const { reportId } = await params;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let reportData: any = {};

    switch (reportId) {
      case "user-activity":
        const users = await User.find(
          Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
        ).lean();

        const sessions = await Session.find(
          Object.keys(dateFilter).length > 0 ? { loginAt: dateFilter } : {},
        ).lean();

        // Calculate average session duration
        const avgSessionTime =
          sessions.length > 0
            ? sessions.reduce((sum, s) => {
                const duration = s.lastActivity
                  ? new Date(s.lastActivity).getTime() -
                    new Date(s.loginAt).getTime()
                  : 0;
                return sum + duration;
              }, 0) / sessions.length
            : 0;

        const avgMinutes = Math.floor(avgSessionTime / 60000);

        reportData = {
          stats: [
            { label: "Total Users", value: users.length },
            { label: "Active Sessions", value: sessions.length },
            { label: "Avg Session Time", value: `${avgMinutes}m` },
          ],
          tables: [
            {
              title: "User Activity Details",
              headers: ["Name", "Email", "Joined Date", "Status"],
              rows: users
                .slice(0, 20)
                .map((u) => [
                  u.name,
                  u.email,
                  new Date(u.createdAt).toLocaleDateString(),
                  u.isActive ? "Active" : "Inactive",
                ]),
            },
          ],
          csvData: users.map((u) => ({
            name: u.name,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
          })),
          csvColumns: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "isActive", label: "Active" },
            { key: "createdAt", label: "Joined Date" },
          ] as ExportColumn[],
        };
        break;

      case "revenue-summary":
        const completedOrders = await Order.find({
          status: "completed",
        }).lean();
        const totalRevenue = completedOrders.reduce(
          (sum, o) => sum + o.amount,
          0,
        );

        const activeSubscriptions = await Subscription.find({
          status: "active",
        }).lean();
        const mrr = activeSubscriptions.reduce((sum, sub) => {
          if (sub.billingCycle === "monthly") return sum + sub.amount;
          if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
          if (sub.billingCycle === "quarterly") return sum + sub.amount / 3;
          return sum;
        }, 0);

        const planBreakdown = await Order.aggregate([
          { $match: { status: "completed" } },
          {
            $group: {
              _id: "$plan",
              revenue: { $sum: "$amount" },
              customers: { $addToSet: "$userId" },
            },
          },
        ]);

        const totalForPercentage = planBreakdown.reduce(
          (sum, p) => sum + p.revenue,
          0,
        );

        reportData = {
          stats: [
            {
              label: "Total Revenue",
              value: `$${totalRevenue.toLocaleString()}`,
            },
            { label: "MRR", value: `$${Math.round(mrr).toLocaleString()}` },
            {
              label: "ARR",
              value: `$${Math.round(mrr * 12).toLocaleString()}`,
            },
            {
              label: "Active Subscriptions",
              value: activeSubscriptions.length,
            },
          ],
          tables: [
            {
              title: "Revenue Breakdown",
              headers: ["Plan", "Customers", "Revenue", "Percentage"],
              rows: planBreakdown.map((p) => [
                p._id,
                p.customers.length.toString(),
                `$${p.revenue.toLocaleString()}`,
                `${((p.revenue / totalForPercentage) * 100).toFixed(1)}%`,
              ]),
            },
          ],
          csvData: planBreakdown.map((p) => ({
            plan: p._id,
            customers: p.customers.length,
            revenue: p.revenue,
            percentage: ((p.revenue / totalForPercentage) * 100).toFixed(1),
          })),
          csvColumns: [
            { key: "plan", label: "Plan" },
            { key: "customers", label: "Customers" },
            { key: "revenue", label: "Revenue" },
            { key: "percentage", label: "Percentage" },
          ] as ExportColumn[],
        };
        break;

      case "analytics-overview":
        const allSessions = await Session.find(
          Object.keys(dateFilter).length > 0 ? { loginAt: dateFilter } : {},
        ).lean();

        // Group sessions by referrer
        const referrerGroups = allSessions.reduce((acc: any, s) => {
          const ref = s.referrer || "Direct";
          if (!acc[ref]) {
            acc[ref] = { visits: 0, users: new Set() };
          }
          acc[ref].visits++;
          acc[ref].users.add(s.userId.toString());
          return acc;
        }, {});

        const trafficSources = Object.entries(referrerGroups).map(
          ([source, data]: [string, any]) => [
            source,
            data.visits.toString(),
            data.users.size.toString(),
            "N/A", // Conversion rate not tracked yet
          ],
        );

        reportData = {
          stats: [
            { label: "Total Sessions", value: allSessions.length },
            {
              label: "Unique Visitors",
              value: new Set(allSessions.map((s) => s.userId.toString())).size,
            },
            { label: "Avg Duration", value: "N/A" },
          ],
          tables: [
            {
              title: "Traffic Sources",
              headers: ["Source", "Visits", "Users", "Conversion"],
              rows:
                trafficSources.length > 0
                  ? trafficSources
                  : [["No Data", "0", "0", "0%"]],
            },
          ],
        };
        break;

      case "growth-metrics":
        const allUsers = await User.find().lean();

        const usersByMonth = await User.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        // Calculate retention (simplified - users still active after 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const usersFrom30DaysAgo = await User.find({
          createdAt: { $lte: thirtyDaysAgo },
        }).lean();
        const stillActive = usersFrom30DaysAgo.filter((u) => u.isActive).length;
        const retentionRate =
          usersFrom30DaysAgo.length > 0
            ? (stillActive / usersFrom30DaysAgo.length) * 100
            : 0;

        reportData = {
          stats: [
            { label: "Total Users", value: allUsers.length },
            {
              label: "Active Users",
              value: allUsers.filter((u) => u.isActive).length,
            },
            { label: "Retention (30d)", value: `${retentionRate.toFixed(1)}%` },
          ],
          tables: [
            {
              title: "Monthly Growth",
              headers: ["Month", "New Users"],
              rows: usersByMonth.map((m) => [m._id, m.count.toString()]),
            },
          ],
        };
        break;

      case "subscription-report":
        const allSubscriptions = await Subscription.find().lean();
        const activeSubs = allSubscriptions.filter(
          (s) => s.status === "active",
        );

        const subsByPlan = await Subscription.aggregate([
          {
            $group: {
              _id: { plan: "$plan", status: "$status" },
              count: { $sum: 1 },
            },
          },
        ]);

        const planStats: any = {};
        subsByPlan.forEach((item) => {
          if (!planStats[item._id.plan]) {
            planStats[item._id.plan] = { active: 0, cancelled: 0, expired: 0 };
          }
          planStats[item._id.plan][item._id.status] = item.count;
        });

        const subscriptionMRR = activeSubs.reduce((sum, sub) => {
          if (sub.billingCycle === "monthly") return sum + sub.amount;
          if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
          if (sub.billingCycle === "quarterly") return sum + sub.amount / 3;
          return sum;
        }, 0);

        reportData = {
          stats: [
            { label: "Active Subscriptions", value: activeSubs.length },
            {
              label: "MRR",
              value: `$${Math.round(subscriptionMRR).toLocaleString()}`,
            },
            { label: "Total Subscriptions", value: allSubscriptions.length },
          ],
          tables: [
            {
              title: "Subscription Distribution",
              headers: ["Plan", "Active", "Cancelled", "Expired"],
              rows: Object.entries(planStats).map(
                ([plan, stats]: [string, any]) => [
                  plan,
                  (stats.active || 0).toString(),
                  (stats.cancelled || 0).toString(),
                  (stats.expired || 0).toString(),
                ],
              ),
            },
          ],
        };
        break;

      case "performance-dashboard":
        const perfUsers = await User.find().lean();
        const perfOrders = await Order.find({ status: "completed" }).lean();
        const perfRevenue = perfOrders.reduce((sum, o) => sum + o.amount, 0);
        const perfSubs = await Subscription.find({ status: "active" }).lean();
        const perfMRR = perfSubs.reduce((sum, sub) => {
          if (sub.billingCycle === "monthly") return sum + sub.amount;
          if (sub.billingCycle === "yearly") return sum + sub.amount / 12;
          if (sub.billingCycle === "quarterly") return sum + sub.amount / 3;
          return sum;
        }, 0);

        reportData = {
          stats: [
            {
              label: "Total Revenue",
              value: `$${perfRevenue.toLocaleString()}`,
            },
            {
              label: "Active Users",
              value: perfUsers.filter((u) => u.isActive).length,
            },
            { label: "MRR", value: `$${Math.round(perfMRR).toLocaleString()}` },
            { label: "Total Orders", value: perfOrders.length },
          ],
          tables: [
            {
              title: "Key Performance Indicators",
              headers: ["Metric", "Current", "Status"],
              rows: [
                ["MRR", `$${Math.round(perfMRR).toLocaleString()}`, "Active"],
                ["Active Subscriptions", perfSubs.length.toString(), "Growing"],
                ["Total Users", perfUsers.length.toString(), "Active"],
                ["Completed Orders", perfOrders.length.toString(), "Tracked"],
              ],
            },
          ],
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid report ID" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
