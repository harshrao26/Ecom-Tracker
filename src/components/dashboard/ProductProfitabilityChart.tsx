"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ProfitData {
  name: string;
  profit: number;
  profitMargin: number;
}

interface ProductProfitabilityChartProps {
  data: ProfitData[];
}

export default function ProductProfitabilityChart({
  data,
}: ProductProfitabilityChartProps) {
  // Take top 20 by profit as per screenshot
  const displayData = data.slice(0, 20).map((item) => ({
    ...item,
    // Truncate name for chart
    displayName:
      item.name.length > 25 ? item.name.substring(0, 22) + "..." : item.name,
    "Margin %": item.profitMargin,
    "Total Profit (₹)": item.profit,
  }));

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">💰</span>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
          Product Profitability Analysis
        </h3>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 ml-8">
        Top 20 by profit margin
      </p>

      <div className="flex-1 w-full mt-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="displayName"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{
                paddingTop: "0px",
                paddingBottom: "30px",
                fontSize: "10px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <Bar
              dataKey="Margin %"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="Total Profit (₹)"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
