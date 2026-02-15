"use client";

import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface OrdersByRegionTreemapProps {
  data: any[];
}

const COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"];

const CustomizedContent = (props: any) => {
  const {
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    payload,
    colors,
    rank,
    name,
  } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1),
          strokeOpacity: 1 / (depth + 1),
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="bold"
        >
          {name}
        </text>
      )}
    </g>
  );
};

export default function OrdersByRegionTreemap({
  data,
}: OrdersByRegionTreemapProps) {
  // Format data for Treemap: { name: 'City, State', size: orders }
  const treemapData = data.map((item) => ({
    name: `${item.city}, ${item.state}`,
    size: item.orders,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
          📍
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
            Orders by Region
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Regional order distribution
          </p>
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8b5cf6"
            content={<CustomizedContent colors={COLORS} />}
          >
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
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
