/**
 * RevenueChart Component
 * Line chart showing revenue trend over time
 */

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    revenue: item.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

        <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: "12px" }} />

        <YAxis
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          formatter={(value: any) => [
            `₹${(value || 0).toLocaleString("en-IN")}`,
            "Revenue",
          ]}
        />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: "#3B82F6", r: 4 }}
          activeDot={{ r: 6 }}
          fill="url(#revenueGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
