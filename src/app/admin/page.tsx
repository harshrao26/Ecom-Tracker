"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiActivity,
  FiLogOut,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  startDate: string;
  endDate?: string;
  daysUntilRenewal: number | null;
  storeCount: number;
  totalOrders: number;
  createdAt: string;
  healthScore?: number;
}

interface Metrics {
  totalSubscribers: number;
  activeSubscribers: number;
  churnedSubscribers: number;
  churnRate: string;
  mrr: number;
  planDistribution: Record<string, number>;
}

interface AdvancedMetrics {
  mrrBreakdown: Array<{
    month: string;
    new: number;
    expansion: number;
    contraction: number;
    churn: number;
    net: number;
  }>;
  cohortAnalysis: Array<{
    month: string;
    signupCount: number;
    retention30: number;
    retention60: number;
    retention90: number;
    currentMRR: number;
  }>;
  healthDistribution: {
    healthy: number;
    medium: number;
    atRisk: number;
  };
  ltvCacRatio: {
    avgLTV: number;
    avgCAC: number;
    ratio: string;
  };
  expansionOpportunities: Array<{
    userId: string;
    email: string;
    name: string;
    currentPlan: string;
    suggestedPlan: string;
    reason: string;
    potentialMRR: number;
  }>;
  churnRiskUsers: Array<{
    userId: string;
    email: string;
    name: string;
    plan: string;
    healthScore: number;
    lastLogin: string;
    daysSinceLogin: number | string;
    riskLevel: string;
  }>;
}

export default function SuperAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [advancedMetrics, setAdvancedMetrics] =
    useState<AdvancedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [subscribersRes, metricsRes] = await Promise.all([
        fetch("/api/admin/subscribers"),
        fetch("/api/admin/metrics"),
      ]);

      const subscribersData = await subscribersRes.json();
      const metricsData = await metricsRes.json();

      setSubscribers(subscribersData.subscribers);
      setMetrics(subscribersData.metrics);
      setAdvancedMetrics(metricsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const filteredSubscribers = subscribers.filter((sub) => {
    if (filter === "all") return true;
    if (filter === "active") return sub.status === "active";
    if (filter === "expired")
      return sub.status === "expired" || sub.status === "cancelled";
    if (filter === "expiring")
      return sub.daysUntilRenewal !== null && sub.daysUntilRenewal <= 7;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      expired: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
      trialing: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const styles: Record<string, string> = {
      free: "bg-gray-100 text-gray-700",
      starter: "bg-blue-100 text-blue-700",
      growth: "bg-purple-100 text-purple-700",
      enterprise: "bg-indigo-100 text-indigo-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          styles[plan] || "bg-gray-100 text-gray-700"
        }`}
      >
        {plan}
      </span>
    );
  };

  const HEALTH_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-8 animate-in fade-in duration-700">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FiActivity size={20} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              SaaS Growth Dashboard
            </h1>
          </div>
          <p className="text-indigo-100 font-medium text-sm opacity-80 uppercase tracking-widest text-[10px]">
            Advanced Metrics & Revenue Intelligence
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="relative z-10 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10"
        >
          <FiLogOut />
          Sign Out
        </button>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl -ml-24 -mb-24" />
      </section>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
        {["overview", "revenue", "cohorts", "health", "subscribers"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FiUsers size={24} />
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Subscribers
              </p>
              <h3 className="text-3xl font-black text-gray-900">
                {metrics?.totalSubscribers || 0}
              </h3>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                  <FiCheckCircle size={24} />
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Active Subscribers
              </p>
              <h3 className="text-3xl font-black text-gray-900">
                {metrics?.activeSubscribers || 0}
              </h3>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <FiDollarSign size={24} />
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Monthly Recurring Revenue
              </p>
              <h3 className="text-3xl font-black text-gray-900">
                ₹{(metrics?.mrr || 0).toLocaleString("en-IN")}
              </h3>
            </div>

            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                  <FiAlertCircle size={24} />
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Churn Rate
              </p>
              <h3 className="text-3xl font-black text-gray-900">
                {metrics?.churnRate || 0}%
              </h3>
            </div>
          </div>

          {/* LTV:CAC Ratio */}
          {advancedMetrics?.ltvCacRatio && (
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6">
                LTV:CAC Ratio
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Avg LTV
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    ₹{advancedMetrics.ltvCacRatio.avgLTV.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Avg CAC
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    ₹{advancedMetrics.ltvCacRatio.avgCAC.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Ratio
                  </p>
                  <p className="text-3xl font-black text-indigo-600">
                    {advancedMetrics.ltvCacRatio.ratio}:1
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {parseFloat(advancedMetrics.ltvCacRatio.ratio) >= 3
                      ? "✅ Healthy"
                      : "⚠️ Needs Improvement"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Plan Distribution */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6">
              Plan Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metrics?.planDistribution || {}).map(
                ([plan, count]) => (
                  <div
                    key={plan}
                    className="text-center p-4 rounded-2xl bg-gray-50"
                  >
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                      {plan}
                    </p>
                    <p className="text-2xl font-black text-gray-900">{count}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && advancedMetrics?.mrrBreakdown && (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-6">
            MRR Breakdown (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={advancedMetrics.mrrBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#10b981" name="New MRR" />
              <Bar dataKey="expansion" fill="#3b82f6" name="Expansion" />
              <Bar dataKey="contraction" fill="#f59e0b" name="Contraction" />
              <Bar dataKey="churn" fill="#ef4444" name="Churned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Cohorts Tab */}
      {activeTab === "cohorts" && advancedMetrics?.cohortAnalysis && (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-x-auto">
          <h3 className="text-xl font-black text-gray-900 mb-6">
            Cohort Retention Analysis
          </h3>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Signups
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  30d Retention
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  60d Retention
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  90d Retention
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Current MRR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {advancedMetrics.cohortAnalysis.map((cohort) => (
                <tr
                  key={cohort.month}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {cohort.month}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cohort.signupCount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${cohort.retention30 >= 80 ? "text-green-600" : cohort.retention30 >= 60 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {cohort.retention30}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${cohort.retention60 >= 70 ? "text-green-600" : cohort.retention60 >= 50 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {cohort.retention60}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-bold ${cohort.retention90 >= 60 ? "text-green-600" : cohort.retention90 >= 40 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {cohort.retention90}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ₹{cohort.currentMRR.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === "health" && advancedMetrics && (
        <>
          {/* Health Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6">
                Customer Health Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Healthy",
                        value: advancedMetrics.healthDistribution.healthy,
                      },
                      {
                        name: "Medium",
                        value: advancedMetrics.healthDistribution.medium,
                      },
                      {
                        name: "At Risk",
                        value: advancedMetrics.healthDistribution.atRisk,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {HEALTH_COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Expansion Opportunities */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6">
                Expansion Opportunities (
                {advancedMetrics.expansionOpportunities.length})
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {advancedMetrics.expansionOpportunities.map((opp) => (
                  <div
                    key={opp.userId}
                    className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-900">{opp.name}</p>
                      <span className="px-2 py-1 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                        +₹{opp.potentialMRR}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{opp.email}</p>
                    <p className="text-xs text-gray-500">{opp.reason}</p>
                    <p className="text-xs font-bold text-purple-600 mt-2">
                      {opp.currentPlan} → {opp.suggestedPlan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Churn Risk Users */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6">
              Churn Risk Users ({advancedMetrics.churnRiskUsers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Health Score
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Days Since Login
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Risk Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {advancedMetrics.churnRiskUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getPlanBadge(user.plan)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                user.healthScore >= 70
                                  ? "bg-green-500"
                                  : user.healthScore >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${user.healthScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            {user.healthScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {user.daysSinceLogin}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            user.riskLevel === "high"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {["all", "active", "expired", "expiring"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Subscriber
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Health
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Stores
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Renewal
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscribers.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {sub.name}
                          </p>
                          <p className="text-xs text-gray-500">{sub.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getPlanBadge(sub.plan)}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                (sub.healthScore || 50) >= 70
                                  ? "bg-green-500"
                                  : (sub.healthScore || 50) >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${sub.healthScore || 50}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-600">
                            {sub.healthScore || 50}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {sub.storeCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {sub.totalOrders.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {sub.daysUntilRenewal !== null ? (
                          <div className="flex items-center gap-2">
                            <FiClock
                              size={14}
                              className={
                                sub.daysUntilRenewal <= 7
                                  ? "text-red-500"
                                  : "text-gray-400"
                              }
                            />
                            <span
                              className={`text-xs font-bold ${
                                sub.daysUntilRenewal <= 7
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {sub.daysUntilRenewal} days
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
