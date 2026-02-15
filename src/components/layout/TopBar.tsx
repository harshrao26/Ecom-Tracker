"use client";

import React from "react";
import { FiSearch, FiBell, FiPlus } from "react-icons/fi";

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40 backdrop-blur-md bg-white/80">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-gray-400">
            <FiSearch size={16} />
          </span>
        </div>
        <input
          type="text"
          placeholder="GLOBAL TERMINAL SEEK"
          className="block w-full pl-11 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <div className="text-[10px] font-bold bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm text-gray-400">
            K
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 bg-[#0A1020] text-white px-4 py-2 rounded-lg text-[10px] font-bold tracking-widest hover:bg-black transition-colors">
          <span>
            <FiPlus size={14} />
          </span>
          QUICK CREATE
        </button>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <span>
            <FiBell size={20} />
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-900 leading-none">
              ADMIN
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-[9px] font-bold text-green-600 uppercase tracking-tighter">
                Root Access
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-100 overflow-hidden border-2 border-white">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Admin"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
