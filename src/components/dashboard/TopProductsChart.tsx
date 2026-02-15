/**
 * TopProductsChart Component
 * Bar chart showing top products by revenue
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

interface TopProductsChartProps {
  data: Array<{
    name: string;
    revenue: number;
    profitMargin: number;
  }>;
}

export default function TopProductsChart({ data }: TopProductsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No product data available
      </div>
    );
  }

  // Take top 5 products
  const chartData = data.slice(0, 5).map((item) => ({
    name:
      item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
    revenue: item.revenue,
    margin: item.profitMargin,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="horizontal">
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

        <XAxis
          type="number"
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />

        <YAxis
          type="category"
          dataKey="name"
          stroke="#6B7280"
          style={{ fontSize: "12px" }}
          width={120}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          formatter={(value: number, name: string) => {
            if (name === "revenue") {
              return [`₹${value.toLocaleString("en-IN")}`, "Revenue"];
            }
            return [value, name];
          }}
        />

        <Bar dataKey="revenue" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
