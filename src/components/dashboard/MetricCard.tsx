/**
 * MetricCard Component
 * Displays KPI metrics with trend indicators
 */

import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
  subtitle,
}: MetricCardProps) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
          {icon}
        </div>

        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>

      <h3 className="text-sm text-gray-600 font-medium mb-2">{title}</h3>

      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
    </div>
  );
}
