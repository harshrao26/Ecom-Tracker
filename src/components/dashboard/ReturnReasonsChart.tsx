"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ReturnReasonsChartProps {
  data: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#fbbf24",
  "#10b981",
];

export default function ReturnReasonsChart({ data }: ReturnReasonsChartProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">
            Root Cause Analysis
          </p>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Common Return Reasons
          </h3>
        </div>
      </div>

      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
              nameKey="reason"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                      <p className="text-xs font-black text-gray-900 mb-1">
                        {payload[0].name}
                      </p>
                      <p className="text-[10px] font-bold text-pink-600 uppercase">
                        {payload[0].value} incidents (
                        {payload[0].payload.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              formatter={(value) => (
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-2 truncate inline-block max-w-[120px]">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
