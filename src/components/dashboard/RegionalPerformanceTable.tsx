"use client";

import React from "react";

interface RegionalData {
  city: string;
  state: string;
  orders: number;
  revenue: number;
  aov: number;
}

interface RegionalPerformanceTableProps {
  data: RegionalData[];
}

export default function RegionalPerformanceTable({
  data,
}: RegionalPerformanceTableProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          📊
        </div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
          Regional Performance Table
        </h3>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Region
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Orders
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Revenue
              </th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Aov
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="group hover:bg-gray-50/50 transition-all"
                >
                  <td className="py-4">
                    <p className="text-xs font-bold text-gray-900">
                      {item.city}, {item.state}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-bold text-gray-600">
                      {item.orders}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-black text-green-600">
                      ₹
                      {item.revenue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-xs font-bold text-gray-400">
                      ₹
                      {item.aov.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                >
                  No regional data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
