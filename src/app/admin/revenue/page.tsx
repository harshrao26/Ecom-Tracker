"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiShoppingCart,
  FiCreditCard,
  FiDownload,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { exportToCSV, formatters, ExportColumn } from "@/lib/utils/exportCSV";

interface RevenueData {
  summary: {
    totalRevenue: number;
    mrr: number;
    arr: number;
    growth: number;
    avgOrderValue: number;
    totalTransactions: number;
  };
  revenueOverTime: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  revenueByPlan: Array<{
    plan: string;
    revenue: number;
    customers: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    orderCount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    customerName: string;
    amount: number;
    plan: string;
    date: string;
    status: string;
  }>;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/revenue?period=${selectedPeriod}`,
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportTransactions = () => {
    if (!data?.recentTransactions) return;

    const columns: ExportColumn[] = [
      { key: "customerName", label: "Customer" },
      { key: "plan", label: "Plan" },
      {
        key: "amount",
        label: "Amount",
        format: (val) => formatters.currency(val),
      },
      { key: "status", label: "Status" },
      { key: "date", label: "Date", format: formatters.datetime },
    ];

    exportToCSV(data.recentTransactions, columns, "revenue_transactions");
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading revenue data...</p>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <AdminSidebar />
        <div className="ml-64 min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
              <FiDollarSign className="text-gray-400 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No Revenue Data
              </h2>
              <p className="text-gray-500">
                Revenue data will appear here once transactions are recorded.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <FiDollarSign className="text-green-600" />
                Revenue Analytics
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Track revenue, subscriptions, and financial metrics
              </p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2">
              {["7d", "30d", "90d", "1y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    selectedPeriod === period
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {period === "7d" && "Last 7 Days"}
                  {period === "30d" && "Last 30 Days"}
                  {period === "90d" && "Last 90 Days"}
                  {period === "1y" && "Last Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <FiDollarSign className="text-green-600" size={24} />
                </div>
                {data.summary.growth > 0 ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                    <FiTrendingUp size={16} />+{data.summary.growth.toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-sm font-bold">
                    <FiTrendingDown size={16} />
                    {data.summary.growth.toFixed(1)}%
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Total Revenue
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {formatCurrency(data.summary.totalRevenue)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <FiTrendingUp className="text-purple-600" size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                MRR / ARR
              </h3>
              <p className="text-2xl font-black text-gray-900">
                {formatCurrency(data.summary.mrr)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ARR: {formatCurrency(data.summary.arr)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <FiShoppingCart className="text-blue-600" size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Avg Order Value
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {formatCurrency(data.summary.avgOrderValue)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <FiCreditCard className="text-orange-600" size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Transactions
              </h3>
              <p className="text-3xl font-black text-gray-900">
                {data.summary.totalTransactions.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Over Time */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4">
                Revenue Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.revenueOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(value: any) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue by Plan */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-4">
                Revenue by Plan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ plan, percent }) =>
                      `${plan} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {data.revenueByPlan.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">
                Top Customers
              </h3>
              <span className="text-sm text-gray-500">By total revenue</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topCustomers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                            {index + 1}
                          </div>
                          <span className="font-bold text-gray-900">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {customer.orderCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">
                Recent Transactions
              </h3>
              <button
                onClick={handleExportTransactions}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold text-sm"
              >
                <FiDownload size={16} />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                          {transaction.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.status}
                        </span>
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
