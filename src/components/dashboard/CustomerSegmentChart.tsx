/**
 * CustomerSegmentChart Component
 * Pie chart showing customer segmentation
 */

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface CustomerSegmentChartProps {
  data: {
    vip?: number;
    regular?: number;
    atRisk?: number;
    churned?: number;
  };
}

const COLORS = {
  vip: "#8B5CF6", // Purple
  regular: "#3B82F6", // Blue
  atRisk: "#F59E0B", // Orange
  churned: "#EF4444", // Red
};

const LABELS = {
  vip: "VIP",
  regular: "Regular",
  atRisk: "At Risk",
  churned: "Churned",
};

export default function CustomerSegmentChart({
  data,
}: CustomerSegmentChartProps) {
  const chartData = [
    { name: LABELS.vip, value: data.vip || 0, color: COLORS.vip },
    { name: LABELS.regular, value: data.regular || 0, color: COLORS.regular },
    { name: LABELS.atRisk, value: data.atRisk || 0, color: COLORS.atRisk },
    { name: LABELS.churned, value: data.churned || 0, color: COLORS.churned },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No customer data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) =>
            `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#FFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          formatter={(value: any) => [value || 0, "Customers"]}
        />

        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
