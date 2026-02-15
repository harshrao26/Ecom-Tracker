"use client";

import React from "react";

interface PricingStrategy {
  productId: string;
  name: string;
  avgPrice: number;
  sold: number;
  revenue: number;
  margin: number;
  action: string;
}

interface PricingStrategyTableProps {
  data: PricingStrategy[];
}

export default function PricingStrategyTable({
  data,
}: PricingStrategyTableProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          💎
        </div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
          Product Pricing Strategy
        </h3>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Product
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Avg Price
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Sold
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Revenue
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Margin %
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.slice(0, 10).map((item, index) => (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/50 transition-all"
                >
                  <td className="py-4">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-bold text-gray-600">
                      ₹{item.avgPrice.toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-bold text-gray-600">
                      {item.sold}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-bold text-gray-900">
                      ₹{item.revenue.toLocaleString("en-IN")}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-black text-gray-900">
                      {item.margin}%
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.action === "Optimal"
                          ? "bg-green-100 text-green-600"
                          : item.action === "Underpriced"
                            ? "bg-yellow-100 text-yellow-600"
                            : item.action === "Overpriced"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                >
                  No pricing data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
