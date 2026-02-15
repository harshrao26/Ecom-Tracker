"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PricingAnalysisChartProps {
  data: any[];
}

export default function PricingAnalysisChart({
  data,
}: PricingAnalysisChartProps) {
  // Take top 20 products
  const chartData = data.slice(0, 20).map((item) => ({
    name: item.name,
    sold: item.sold,
    price: item.avgPrice,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          📊
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Pricing Analysis
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Product pricing insights
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              type="number"
              dataKey="sold"
              name="Units Sold"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              type="number"
              dataKey="price"
              name="Avg Price"
              unit="₹"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <ZAxis type="number" range={[60, 400]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <Scatter name="Products" data={chartData} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
