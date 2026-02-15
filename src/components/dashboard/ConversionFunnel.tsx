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
  Cell,
} from "recharts";

const data = [
  { name: "Visitors", value: 21, color: "#3B82F6" },
  { name: "Added to Cart", value: 16, color: "#10B981" },
  { name: "Checkout", value: 10, color: "#F59E0B" },
  { name: "Completed", value: 8, color: "#EF4444" },
];

export default function ConversionFunnel() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 h-[300px] flex flex-col col-span-1 lg:col-span-1">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          🚀
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Conversion Funnel
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Customer journey analytics
          </p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ left: 20, right: 30 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "#64748B" }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={25}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
