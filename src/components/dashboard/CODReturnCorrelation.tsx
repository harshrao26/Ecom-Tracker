"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CODReturnCorrelationProps {
  data: Array<{
    type: string;
    rtoRate: number;
    returnRate: number;
  }>;
}

export default function CODReturnCorrelation({
  data,
}: CODReturnCorrelationProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
            Payment correlation
          </p>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            COD vs Prepaid Returns
          </h3>
        </div>
      </div>

      <div className="flex-grow min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={12}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="type"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                      <p className="text-xs font-black text-gray-900 mb-2">
                        {payload[0].payload.type} Method
                      </p>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-orange-500 uppercase flex items-center justify-between gap-4">
                          <span>RTO Rate:</span>
                          <span>{payload[0].value}%</span>
                        </p>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase flex items-center justify-between gap-4">
                          <span>Return Rate:</span>
                          <span>{payload[1].value}%</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: 20,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <Bar
              dataKey="rtoRate"
              name="RTO Rate"
              fill="#f59e0b"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
            <Bar
              dataKey="returnRate"
              name="Return Rate"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose bg-gray-50 p-4 rounded-2xl">
        💡 <span className="text-gray-900">Insight:</span> COD orders typically
        have 2-3x higher RTO rates in the Indian market compared to prepaid
        transactions.
      </p>
    </div>
  );
}
