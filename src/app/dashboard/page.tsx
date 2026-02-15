/**
 * Dashboard Main Page
 * Analytics overview with KPIs, charts, and AI insights
 */

"use client";

import { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import RegionalChart from "@/components/dashboard/RegionalChart";
import CustomerSegmentChart from "@/components/dashboard/CustomerSegmentChart";
import CODAnalysisCard from "@/components/dashboard/CODAnalysisCard";
import AIInsights from "@/components/dashboard/AIInsights";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import StoreSelector from "@/components/dashboard/StoreSelector";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");
  const [storeId, setStoreId] = useState("all");

  // TODO: Replace with actual user session
  const userId = "demo-user-123";

  useEffect(() => {
    fetchAnalytics();
  }, [period, storeId]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        period,
        storeId,
      });

      const response = await fetch(
        `/api/analytics/overview?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overview = analytics?.overview || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Aapke business ka complete overview
              </p>
            </div>

            <div className="flex gap-4">
              <PeriodSelector value={period} onChange={setPeriod} />
              <StoreSelector
                value={storeId}
                onChange={setStoreId}
                userId={userId}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`₹${overview.totalRevenue?.toLocaleString("en-IN") || "0"}`}
            change={overview.revenueGrowth || 0}
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
            trend={overview.revenueGrowth >= 0 ? "up" : "down"}
          />

          <MetricCard
            title="Total Orders"
            value={overview.totalOrders?.toLocaleString() || "0"}
            change={overview.ordersGrowth || 0}
            icon={<ShoppingCart className="w-6 h-6 text-green-600" />}
            trend={overview.ordersGrowth >= 0 ? "up" : "down"}
          />

          <MetricCard
            title="Profit"
            value={`₹${overview.totalProfit?.toLocaleString("en-IN") || "0"}`}
            change={overview.profitGrowth || 0}
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            trend={overview.profitGrowth >= 0 ? "up" : "down"}
            subtitle={`${overview.profitMargin || 0}% margin`}
          />

          <MetricCard
            title="Avg Order Value"
            value={`₹${overview.averageOrderValue?.toLocaleString("en-IN") || "0"}`}
            change={overview.aovGrowth || 0}
            icon={<Package className="w-6 h-6 text-orange-600" />}
            trend={overview.aovGrowth >= 0 ? "up" : "down"}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Revenue Trend
            </h3>
            <RevenueChart data={analytics?.dailyTrend || []} />
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Top Products
            </h3>
            <TopProductsChart data={analytics?.topProducts || []} />
          </div>

          {/* Regional Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Cities</h3>
            <RegionalChart data={analytics?.regionalData || []} />
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer Segments
            </h3>
            <CustomerSegmentChart data={analytics?.customerSegments || {}} />
          </div>
        </div>

        {/* COD Analysis */}
        {analytics?.codAnalysis && (
          <div className="mb-8">
            <CODAnalysisCard data={analytics.codAnalysis} />
          </div>
        )}

        {/* AI Insights */}
        <AIInsights userId={userId} period={period} storeId={storeId} />
      </main>
    </div>
  );
}
