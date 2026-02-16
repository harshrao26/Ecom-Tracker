"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  FiUsers,
  FiActivity,
  FiUserPlus,
  FiGlobe,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

interface LiveSession {
  id: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  location: {
    country?: string;
    city?: string;
    region?: string;
  };
  lastActivity: string;
  loginAt: string;
}

interface LocationStat {
  country?: string;
  city?: string;
  sessionCount: number;
  userCount: number;
}

interface AnalyticsData {
  liveActivity: {
    activeVisitors: number;
    activeSessions: number;
    pagesBeingViewed: number;
  };
  liveUsers: {
    count: number;
    sessions: LiveSession[];
  };
  totalUsers: number;
  newSignups: number;
  uniqueIPs: number;
  locationStats: LocationStat[];
  visitsOverTime: Array<{ date: string; visits: number }>;
  deviceStats: Array<{ device: string; count: number }>;
  trafficSources: Array<{ referrer: string; hits: number; users: number }>;
  recentSessions: LiveSession[];
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await res.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  // Auto-refresh every 10 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, period]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Platform Analytics
                </h1>
                <p className="text-gray-500 font-medium mt-1">
                  Real-time user tracking and engagement metrics
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Period Selector */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>

                {/* Auto Refresh Toggle */}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                    autoRefresh
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  <FiRefreshCw
                    className={autoRefresh ? "animate-spin" : ""}
                    size={16}
                  />
                  {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
                </button>
              </div>
            </div>
          </div>

          {/* Live Activity Widget */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">
                Live Activity
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Live Right Now
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Visitors */}
              <div className="text-center">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {analytics?.liveActivity?.activeVisitors || 0}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                  <span>👥</span>
                  <span>Active Visitors</span>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="text-center border-x border-gray-100">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {analytics?.liveActivity?.activeSessions || 0}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                  <span>⚡</span>
                  <span>Active Sessions</span>
                </div>
              </div>

              {/* Pages Being Viewed */}
              <div className="text-center">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {analytics?.liveActivity?.pagesBeingViewed || 0}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                  <span>🌐</span>
                  <span>Pages Being Viewed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Live Users */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <FiActivity className="text-green-600" size={24} />
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {analytics?.liveUsers.count || 0}
              </div>
              <div className="text-sm font-bold text-gray-500">
                Live Users (Last 5min)
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <FiUsers className="text-indigo-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {analytics?.totalUsers || 0}
              </div>
              <div className="text-sm font-bold text-gray-500">Total Users</div>
            </div>

            {/* New Signups */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FiUserPlus className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {analytics?.newSignups || 0}
              </div>
              <div className="text-sm font-bold text-gray-500">
                New Signups ({period})
              </div>
            </div>

            {/* Unique IPs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <FiGlobe className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">
                {analytics?.uniqueIPs || 0}
              </div>
              <div className="text-sm font-bold text-gray-500">
                Unique IPs ({period})
              </div>
            </div>
          </div>

          {/* Visits Over Time Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">
                Visits Over Time
              </h2>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                  DAY
                </button>
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">
                  WEEK
                </button>
              </div>
            </div>
            <div className="h-64">
              {analytics?.visitsOverTime &&
              analytics.visitsOverTime.length > 0 ? (
                <div className="relative h-full">
                  <svg className="w-full h-full" viewBox="0 0 800 200">
                    {/* Grid lines */}
                    <line
                      x1="0"
                      y1="0"
                      x2="800"
                      y2="0"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="50"
                      x2="800"
                      y2="50"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2="800"
                      y2="100"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="150"
                      x2="800"
                      y2="150"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="200"
                      x2="800"
                      y2="200"
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />

                    {/* Line chart */}
                    <polyline
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      points={analytics.visitsOverTime
                        .map((d, i) => {
                          const x =
                            (i /
                              Math.max(
                                analytics.visitsOverTime.length - 1,
                                1,
                              )) *
                            800;
                          const maxVisits = Math.max(
                            ...analytics.visitsOverTime.map((v) => v.visits),
                          );
                          const y =
                            200 - (d.visits / Math.max(maxVisits, 1)) * 180;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />

                    {/* Data points */}
                    {analytics.visitsOverTime.map((d, i) => {
                      const x =
                        (i / Math.max(analytics.visitsOverTime.length - 1, 1)) *
                        800;
                      const maxVisits = Math.max(
                        ...analytics.visitsOverTime.map((v) => v.visits),
                      );
                      const y = 200 - (d.visits / Math.max(maxVisits, 1)) * 180;
                      return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#4f46e5" />
                      );
                    })}
                  </svg>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {analytics.visitsOverTime.map((d, i) => (
                      <span key={i}>{d.date.slice(5)}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No visit data available
                </div>
              )}
            </div>
          </div>

          {/* Traffic by Device & Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Device Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                Traffic by Device
              </h2>

              {analytics?.deviceStats && analytics.deviceStats.length > 0 ? (
                <div className="space-y-6">
                  {/* Simple Donut Chart */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg
                        viewBox="0 0 100 100"
                        className="transform -rotate-90"
                      >
                        {(() => {
                          const total = analytics.deviceStats.reduce(
                            (sum, d) => sum + d.count,
                            0,
                          );
                          const colors = {
                            desktop: "#22c55e",
                            mobile: "#ef4444",
                            tablet: "#f59e0b",
                            unknown: "#6b7280",
                          };
                          let cumulativePercent = 0;

                          return analytics.deviceStats.map((stat) => {
                            const percent = (stat.count / total) * 100;
                            const strokeDasharray = `${percent} ${100 - percent}`;
                            const strokeDashoffset = -cumulativePercent;
                            cumulativePercent += percent;

                            return (
                              <circle
                                key={stat.device}
                                cx="50"
                                cy="50"
                                r="15.915"
                                fill="transparent"
                                stroke={
                                  colors[stat.device as keyof typeof colors] ||
                                  "#6b7280"
                                }
                                strokeWidth="12"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300"
                              />
                            );
                          });
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Device Stats */}
                  <div className="space-y-3">
                    {analytics.deviceStats.map((stat) => {
                      const total = analytics.deviceStats.reduce(
                        (sum, d) => sum + d.count,
                        0,
                      );
                      const percentage = ((stat.count / total) * 100).toFixed(
                        1,
                      );
                      const icons = {
                        desktop: "🖥️",
                        mobile: "📱",
                        tablet: "📱",
                        unknown: "❓",
                      };

                      return (
                        <div
                          key={stat.device}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {icons[stat.device as keyof typeof icons] || "❓"}
                            </span>
                            <span className="text-sm font-bold text-gray-700 capitalize">
                              {stat.device}
                            </span>
                          </div>
                          <span className="text-xl font-black text-indigo-600">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No device data available
                </div>
              )}
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6">
                Traffic Sources
              </h2>

              {analytics?.trafficSources &&
              analytics.trafficSources.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {analytics.trafficSources.map((source, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-sm text-gray-600 font-medium">
                          {source.referrer === "direct" ? "🔗" : "🌐"}
                        </span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-500 font-medium">
                            {source.referrer === "direct"
                              ? "direct"
                              : source.referrer}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-bold uppercase whitespace-nowrap">
                            {source.referrer === "direct"
                              ? "DIRECT"
                              : "REFERRER"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-indigo-600">
                          {source.hits}
                        </div>
                        <div className="text-xs text-gray-500">Hits</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No traffic source data available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Users List */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiActivity className="text-green-600" />
                Currently Active Users
              </h2>

              {analytics?.liveUsers.sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FiUsers size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No active users right now</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analytics?.liveUsers.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900">
                            {session.userName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.userEmail}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-green-600">
                          {formatTime(session.lastActivity)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiGlobe size={12} />
                          {session.ipAddress}
                        </div>
                        {session.location?.city && (
                          <div className="flex items-center gap-1">
                            <FiMapPin size={12} />
                            {session.location.city}
                            {session.location.country &&
                              `, ${session.location.country}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="text-indigo-600" />
                Geographic Distribution
              </h2>

              {analytics?.locationStats.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FiGlobe size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No location data yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analytics?.locationStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900">
                          {stat.city || "Unknown City"}
                          {stat.country && `, ${stat.country}`}
                        </div>
                        <div className="text-xs font-bold text-indigo-600">
                          {stat.userCount} users
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {stat.sessionCount} session
                        {stat.sessionCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              Recent Sessions
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="pb-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="pb-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="pb-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                      Login At
                    </th>
                    <th className="pb-3 text-xs font-black text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analytics?.recentSessions.slice(0, 20).map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="font-bold text-sm text-gray-900">
                          {session.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.userEmail}
                        </div>
                      </td>
                      <td className="py-3 text-sm font-mono text-gray-600">
                        {session.ipAddress}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {session.location?.city || "Unknown"}
                        {session.location?.country &&
                          `, ${session.location.country}`}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatTime(session.loginAt)}
                      </td>
                      <td className="py-3">
                        {new Date(session.lastActivity).getTime() >
                        Date.now() - 5 * 60 * 1000 ? (
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
