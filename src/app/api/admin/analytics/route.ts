import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Session from "@/lib/db/models/Session";
import User from "@/lib/db/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query params for filters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "24h";

    // Calculate time range
    let startDate: Date;
    switch (period) {
      case "1h":
        startDate = new Date(Date.now() - 60 * 60 * 1000);
        break;
      case "24h":
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get live users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const liveSessions = await Session.find({
      isActive: true,
      lastActivity: { $gte: fiveMinutesAgo },
    })
      .sort({ lastActivity: -1 })
      .lean();

    // Calculate live activity metrics
    const activeVisitors = new Set(liveSessions.map((s) => s.userId.toString()))
      .size;
    const activeSessions = liveSessions.length;
    const pagesBeingViewed = new Set(
      liveSessions.map((s) => s.currentPage).filter(Boolean),
    ).size;

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get signups in period
    const newSignups = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get sessions by location
    const locationStats = await Session.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            country: "$location.country",
            city: "$location.city",
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          country: "$_id.country",
          city: "$_id.city",
          sessionCount: "$count",
          userCount: { $size: "$uniqueUsers" },
        },
      },
      {
        $sort: { sessionCount: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    // Get recent sessions with full details
    const recentSessions = await Session.find({
      createdAt: { $gte: startDate },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Get unique IPs
    const uniqueIPs = await Session.distinct("ipAddress", {
      createdAt: { $gte: startDate },
    });

    // Get visits over time (time-series data)
    const visitsOverTime = await Session.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          visits: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          visits: 1,
          _id: 0,
        },
      },
    ]);

    // Get device breakdown
    const deviceStats = await Session.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          device: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get traffic sources/referrers
    const trafficSources = await Session.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          referrer: "$_id",
          hits: "$count",
          users: { $size: "$uniqueUsers" },
          _id: 0,
        },
      },
      {
        $sort: { hits: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        liveActivity: {
          activeVisitors,
          activeSessions,
          pagesBeingViewed,
        },
        liveUsers: {
          count: liveSessions.length,
          sessions: liveSessions.map((s) => ({
            id: s._id,
            userName: s.userName,
            userEmail: s.userEmail,
            ipAddress: s.ipAddress,
            location: s.location,
            lastActivity: s.lastActivity,
            loginAt: s.loginAt,
          })),
        },
        totalUsers,
        newSignups,
        uniqueIPs: uniqueIPs.length,
        locationStats,
        visitsOverTime,
        deviceStats,
        trafficSources,
        recentSessions: recentSessions.map((s) => ({
          id: s._id,
          userName: s.userName,
          userEmail: s.userEmail,
          ipAddress: s.ipAddress,
          location: s.location,
          loginAt: s.loginAt,
          logoutAt: s.logoutAt,
          isActive: s.isActive,
        })),
      },
    });
  } catch (error: any) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
