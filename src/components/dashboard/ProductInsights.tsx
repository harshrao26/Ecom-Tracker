"use client";

import React from "react";
import { FiTrendingUp, FiAlertCircle, FiPackage } from "react-icons/fi";

interface ProductInsightsProps {
  fastMoving: number;
  slowMoving: number;
  outOfStock: number;
}

export default function ProductInsights({
  fastMoving,
  slowMoving,
  outOfStock,
}: ProductInsightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Fast Moving */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-green-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Fast Moving Products
            </h3>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {fastMoving}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              High velocity items
            </p>
          </div>
        </div>
      </div>

      {/* Slow Moving */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-yellow-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Slow Moving Products
            </h3>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {slowMoving}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">Need attention</p>
          </div>
        </div>
      </div>

      {/* Out of Stock */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-red-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <FiPackage size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Out of Stock
            </h3>
            <p className="text-2xl font-black text-gray-900 leading-none">
              {outOfStock}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">Restock required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
