"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProfitMarginByProductChartProps {
  data: any[];
}

export default function ProfitMarginByProductChart({
  data,
}: ProfitMarginByProductChartProps) {
  // Format data for the chart (Horizontal Bar)
  const chartData = data.slice(0, 15).map((item) => ({
    name:
      item.name.length > 20 ? item.name.substring(0, 18) + "..." : item.name,
    fullName: item.name,
    margin: item.profitMargin,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
          💰
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Profit Margin by Product
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Top 15 products by profitability
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
              width={100}
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
              formatter={(value) => [`${value}%`, "Margin"]}
            />
            <Bar
              dataKey="margin"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
