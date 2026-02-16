"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiShoppingBag,
  FiRotateCcw,
  FiImage,
  FiStar,
  FiTag,
  FiDollarSign,
  FiMessageSquare,
  FiBarChart2,
  FiTarget,
  FiCpu,
  FiClock,
  FiLayers,
} from "react-icons/fi";
import { FaRegLightbulb } from "react-icons/fa";

const sidebarItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: FiBarChart2,
    path: "/dashboard",
  },
  {
    id: "insights",
    label: "Insights",
    icon: FaRegLightbulb,
    path: "/dashboard/insights",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: FiLayers,
    path: "/dashboard/integrations",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0A1020] h-screen fixed left-0 top-0 text-gray-400 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
          OP
        </div>
        <div>
          <h1 className="text-white font-bold text-sm tracking-widest leading-none">
            ONLINE PLANET
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
            Admin Terminal
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/dashboard" && pathname === "/dashboard");

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border-l-4 border-blue-600 pl-3 shadow-[inset_0_0_10px_rgba(37,99,235,0.05)]"
                  : "hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <span
                className={
                  isActive ? "text-blue-500" : "group-hover:text-white"
                }
              >
                <item.icon size={20} />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-red-900/20 border border-red-900/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
              System Core v4.2
            </span>
          </div>
          <span className="text-[10px] text-red-400 font-bold">1 ISSUE</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
