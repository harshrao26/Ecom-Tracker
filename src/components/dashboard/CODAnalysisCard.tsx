/**
 * CODAnalysisCard Component
 * Displays COD vs Prepaid analysis
 */

"use client";

interface CODAnalysisCardProps {
  data: {
    codRevenue: number;
    prepaidRevenue: number;
    codOrders: number;
    prepaidOrders: number;
    codPercentage: number;
  };
}

export default function CODAnalysisCard({ data }: CODAnalysisCardProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border border-orange-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-orange-500 rounded-lg">
          <span className="text-2xl">💰</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          COD vs Prepaid Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COD */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Cash on Delivery
            </span>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-1">
            ₹{data.codRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-600">
            {data.codOrders} orders · {data.codPercentage}%
          </p>

          {/* Progress bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.codPercentage}%` }}
            />
          </div>
        </div>

        {/* Prepaid */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Prepaid/Online
            </span>
            <span className="text-2xl">💳</span>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">
            ₹{data.prepaidRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-600">
            {data.prepaidOrders} orders ·{" "}
            {(100 - data.codPercentage).toFixed(1)}%
          </p>

          {/* Progress bar */}
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${100 - data.codPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insight */}
      {data.codPercentage > 60 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>High COD ratio:</strong> COD {data.codPercentage}% hai.
            Prepaid ko encourage karne ke liye discount offers try karo!
          </p>
        </div>
      )}
    </div>
  );
}
