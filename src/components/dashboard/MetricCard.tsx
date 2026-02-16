"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  description?: string;
  comparisonLabel?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
  subtitle,
  description,
  comparisonLabel,
}: MetricCardProps) {
  return (
    <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
      {/* Decorative gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-2xl ${
              title.toLowerCase().includes("revenue")
                ? "bg-green-100 text-green-600"
                : title.toLowerCase().includes("orders")
                  ? "bg-blue-100 text-blue-600"
                  : title.toLowerCase().includes("profit") ||
                      title.toLowerCase().includes("growth")
                    ? "bg-purple-100 text-purple-600"
                    : "bg-orange-100 text-orange-600"
            } shadow-sm group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>

          {change !== undefined && (
            <div className="flex flex-col items-end">
              <div
                className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  trend === "up"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {trend === "up" ? "↗" : "↘"} {Math.abs(change)}%
              </div>
              {comparisonLabel && (
                <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
                  {comparisonLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none overflow-hidden text-ellipsis whitespace-nowrap">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[10px] font-bold text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-[10px] text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}
