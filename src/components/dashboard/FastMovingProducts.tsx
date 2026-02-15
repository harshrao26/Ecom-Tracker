"use client";

import React from "react";

interface Product {
  id: string;
  name: string;
  units: number;
  revenue: number;
}

interface FastMovingProductsProps {
  products: Product[];
}

export default function FastMovingProducts({
  products,
}: FastMovingProductsProps) {
  return (
    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🔥</span>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
          Fast Moving Products
        </h3>
      </div>

      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100 group hover:scale-[1.01] transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-green-600">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">
                    {product.name}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                    {product.units} units sold
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">
                  ₹{product.revenue?.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            No high-velocity items found
          </p>
        )}
      </div>
    </div>
  );
}
