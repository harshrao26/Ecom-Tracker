/**
 * RegionalChart Component
 * Bar chart showing top cities by revenue
 */

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RegionalChartProps {
  data: Array<{
    city: string;
    state?: string;
    revenue: number;
    orders: number;
  }>;
}

export default function RegionalChart({ data }: RegionalChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No regional data available
      </div>
    );
  }

  // Take top 8 cities
  const chartData = data.slice(0, 8).map((item) => ({
    city: item.city,
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

        <XAxis
          dataKey="city"
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />

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
          formatter={(value: any, name: any) => {
            if (name === "revenue") {
              return [`₹${(value || 0).toLocaleString("en-IN")}`, "Revenue"];
            }
            return [value || 0, "Orders"];
          }}
        />

        <Bar
          dataKey="revenue"
          fill="url(#cityGradient)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
