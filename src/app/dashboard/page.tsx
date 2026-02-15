/**
 * Dashboard Main Page
 * Advanced Analytics overview with Indigo premium theme
 */

"use client";

import { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import RevenueTrend from "@/components/dashboard/RevenueTrend";
import OrderStatusPie from "@/components/dashboard/OrderStatusPie";
import TopSellingProductsChart from "@/components/dashboard/TopSellingProductsChart";
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart";
import RevenueByStateChart from "@/components/dashboard/RevenueByStateChart";
import OrdersByRegionTreemap from "@/components/dashboard/OrdersByRegionTreemap";
import RegionalPerformanceTable from "@/components/dashboard/RegionalPerformanceTable";
import ProfitMarginByProductChart from "@/components/dashboard/ProfitMarginByProductChart";
import PriceRangeDistributionChart from "@/components/dashboard/PriceRangeDistributionChart";
import DiscountEffectivenessChart from "@/components/dashboard/DiscountEffectivenessChart";
import PricingAnalysisChart from "@/components/dashboard/PricingAnalysisChart";
import PricingStrategyTable from "@/components/dashboard/PricingStrategyTable";
import CustomerSegmentationChart from "@/components/dashboard/CustomerSegmentationChart";
import PurchaseFrequencyChart from "@/components/dashboard/PurchaseFrequencyChart";
import TopCustomersTable from "@/components/dashboard/TopCustomersTable";
import HourlyAnalysis from "@/components/dashboard/HourlyAnalysis";
import WeeklyAnalysis from "@/components/dashboard/WeeklyAnalysis";
import ConversionFunnel from "@/components/dashboard/ConversionFunnel";
import ProductInsights from "@/components/dashboard/ProductInsights";
import FastMovingProducts from "@/components/dashboard/FastMovingProducts";
import ProductProfitabilityChart from "@/components/dashboard/ProductProfitabilityChart";
import AIInsights from "@/components/dashboard/AIInsights";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiActivity,
  FiGrid,
  FiMapPin,
  FiUsers,
  FiPackage,
  FiClock,
  FiCpu,
} from "react-icons/fi";
import Link from "next/link";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("Last Year");
  const [activeTab, setActiveTab] = useState("Overview");

  // TODO: Replace with actual user session
  const userId = "6991fdaa767d73422e21e18d";

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        userId,
        period: period === "Last Year" ? "1y" : "30d",
        storeId: "all",
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
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Initializing Analytics...
          </p>
        </div>
      </div>
    );
  }

  const overview = analytics?.overview || {};

  const tabs = [
    { id: "Overview", icon: FiGrid },
    { id: "Regional", icon: FiMapPin },
    { id: "Pricing", icon: FiDollarSign },
    { id: "Customers", icon: FiUsers },
    { id: "Products", icon: FiPackage },
    { id: "Time Analysis", icon: FiClock },
  ];

  return (
    <div className="px-8 space-y-8 animate-in fade-in duration-700">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="text-white">
                  <FiActivity size={20} />
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">
                Advanced Analytics Dashboard
              </h1>
            </div>
            <p className="text-blue-100 font-medium text-sm opacity-80 uppercase tracking-widest text-[10px]">
              Comprehensive business intelligence with AI-powered insights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-2 ring-white/30 cursor-pointer hover:bg-white/20 transition-all"
            >
              <option className="bg-blue-600">Last 30 Days</option>
              <option className="bg-blue-600">Last Year</option>
            </select>

            <Link href="/dashboard/insights">
              <button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all">
                <span>
                  <FiCpu size={14} />
                </span>
                AI Predictions
              </button>
            </Link>
          </div>
        </div>

        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl -ml-24 -mb-24" />
      </section>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar sticky top-16 z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span>
              <tab.icon size={14} />
            </span>
            {tab.id}
          </button>
        ))}
      </nav>

      {/* Main Stats (Present in all tabs except maybe a few) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₹${overview.totalRevenue?.toLocaleString("en-IN") || "0"}`}
          change={overview.revenueGrowth || 0}
          icon={<FiDollarSign size={24} />}
          trend={overview.revenueGrowth >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Total Orders"
          value={overview.totalOrders?.toLocaleString() || "0"}
          change={overview.ordersGrowth || 0}
          icon={<FiShoppingBag size={24} />}
          trend={overview.ordersGrowth >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Average Order Value"
          value={`₹${overview.averageOrderValue?.toLocaleString("en-IN") || "0"}`}
          change={overview.aovGrowth || 0}
          icon={<FiTrendingUp size={24} />}
          trend={overview.aovGrowth >= 0 ? "up" : "down"}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${overview.conversionRate || "450.0"}%`}
          change={12.5}
          icon={<FiActivity size={24} />}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Customers",
            value: analytics?.customers?.length || "0",
            icon: "👥",
          },
          {
            label: "Products",
            value: analytics?.products?.length || "0",
            icon: "📦",
          },
          { label: "Retention", value: "100.0%", icon: "🔄" },
          { label: "Avg Rating", value: "0.0/5", icon: "⭐" },
          { label: "Cart Size", value: "1.0 items", icon: "🛒" },
          { label: "Sellers", value: "2", icon: "🚛" },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3"
          >
            <span className="text-xl">{m.icon}</span>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                {m.label}
              </p>
              <p className="text-sm font-black text-gray-900 leading-none mt-0.5">
                {m.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === "Overview" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full">
              <RevenueTrend data={analytics?.dailyTrend || []} />
            </div>
            <div className="h-full">
              <OrderStatusPie data={analytics?.orderStatus || []} />
            </div>
            <div className="h-full">
              <TopSellingProductsChart data={analytics?.topProducts || []} />
            </div>
            <div className="h-full">
              <CategoryDistributionChart
                data={analytics?.categoryDistribution || []}
              />
            </div>
          </div>
        </div>
      )}

      {/* Regional Tab Content */}
      {activeTab === "Regional" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full min-h-[400px]">
              <RevenueByStateChart data={analytics?.stateData || []} />
            </div>
            <div className="h-full min-h-[400px]">
              <OrdersByRegionTreemap data={analytics?.regionalData || []} />
            </div>
          </div>
          <div className="w-full">
            <RegionalPerformanceTable data={analytics?.regionalData || []} />
          </div>
        </div>
      )}

      {/* Pricing Tab Content */}
      {activeTab === "Pricing" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full min-h-[400px]">
              <ProfitMarginByProductChart
                data={analytics?.profitAnalysis || []}
              />
            </div>
            <div className="h-full min-h-[400px]">
              <PriceRangeDistributionChart
                data={analytics?.priceRangeDistribution || []}
              />
            </div>
            <div className="h-full min-h-[400px]">
              <DiscountEffectivenessChart
                data={analytics?.discountEffectiveness || []}
              />
            </div>
            <div className="h-full min-h-[400px]">
              <PricingAnalysisChart data={analytics?.pricingStrategy || []} />
            </div>
          </div>
          <div className="w-full">
            <PricingStrategyTable data={analytics?.pricingStrategy || []} />
          </div>
        </div>
      )}

      {/* Customers Tab Content */}
      {activeTab === "Customers" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Customer Specific Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  New Customers
                </p>
                <h4 className="text-2xl font-black text-gray-900">
                  {analytics?.customers?.length || 0}
                </h4>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                  In selected period
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <FiActivity size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Repeat Customers
                </p>
                <h4 className="text-2xl font-black text-gray-900">
                  {analytics?.customers?.filter((c: any) => c.totalOrders > 1)
                    .length || 0}
                </h4>
                <p className="text-[9px] font-bold text-green-500 mt-0.5">
                  100.0% Retention
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <FiDollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Avg CLV
                </p>
                <h4 className="text-2xl font-black text-gray-900">
                  ₹
                  {Math.round(
                    ((overview.totalRevenue || 0) /
                      (analytics?.customers?.length || 1)) *
                      1.5,
                  ).toLocaleString("en-IN")}
                </h4>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                  Estimated lifetime value
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full min-h-[400px]">
              <CustomerSegmentationChart
                data={[
                  { name: "0", count: analytics?.customers?.length || 0 },
                  {
                    name: "1000",
                    count:
                      analytics?.customers?.filter(
                        (c: any) => c.totalSpent > 1000,
                      ).length || 0,
                  },
                ]}
              />
            </div>
            <div className="h-full min-h-[400px]">
              <PurchaseFrequencyChart
                data={analytics?.customerPurchaseFrequency || []}
              />
            </div>
          </div>
          <div className="w-full">
            <TopCustomersTable data={analytics?.topCustomers || []} />
          </div>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === "Products" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <ProductInsights
            fastMoving={analytics?.inventoryHealth?.fastMoving || 0}
            slowMoving={analytics?.inventoryHealth?.slowMoving || 0}
            outOfStock={analytics?.inventoryHealth?.outOfStock || 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <FastMovingProducts products={analytics?.topProducts || []} />
            </div>
            <div className="lg:col-span-2">
              <ProductProfitabilityChart
                data={analytics?.profitAnalysis || []}
              />
            </div>
          </div>
        </div>
      )}

      {/* Time Analysis Tab Content */}
      {activeTab === "Time Analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <HourlyAnalysis />
          <WeeklyAnalysis />
          <div className="lg:col-span-2">
            <ConversionFunnel />
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {![
        "Overview",
        "Regional",
        "Pricing",
        "Customers",
        "Products",
        "Time Analysis",
      ].includes(activeTab) && (
        <div className="h-64 bg-white rounded-[32px] border-2 border-dashed border-gray-100 flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center">
            <span className="text-3xl mb-4 block opacity-50">🚧</span>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {activeTab} Module Coming Soon
            </p>
          </div>
        </div>
      )}

      {/* Bottom Insights */}
      <div className="pb-12">
        <AIInsights userId={userId} period={"30d"} storeId={"all"} />
      </div>
    </div>
  );
}
