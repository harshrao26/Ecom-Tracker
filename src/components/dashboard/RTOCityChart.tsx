"use client";

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

interface RTOCityChartProps {
  data: Array<{
    city: string;
    rate: number;
    total: number;
  }>;
}

export default function RTOCityChart({ data }: RTOCityChartProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
            Regional Risks
          </p>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            RTO Rate by City
          </h3>
        </div>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Top 10 High Risk
          </span>
        </div>
      </div>

      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f0f0f0"
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="city"
              type="category"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                      <p className="text-xs font-black text-gray-900 mb-1">
                        {payload[0].payload.city}
                      </p>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">
                        RTO Rate: {payload[0].value}%
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                        Volume: {payload[0].payload.total} orders
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rate" radius={[0, 10, 10, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.rate > 20
                      ? "#ef4444"
                      : entry.rate > 10
                        ? "#f59e0b"
                        : "#6366f1"
                  }
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              High Risk (&gt;20%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Average Risk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
