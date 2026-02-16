"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiActivity,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiCreditCard,
} from "react-icons/fi";

const adminSidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FiHome,
    path: "/admin",
  },
  {
    id: "analytics",
    label: "Live Analytics",
    icon: FiActivity,
    path: "/admin/analytics",
  },
  {
    id: "payments",
    label: "Payments",
    icon: FiCreditCard,
    path: "/admin/payments",
  },
  {
    id: "users",
    label: "Users",
    icon: FiUsers,
    path: "/admin/users",
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: FiDollarSign,
    path: "/admin/revenue",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FiBarChart2,
    path: "/admin/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: FiSettings,
    path: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0A1020] h-screen fixed left-0 top-0 text-gray-400 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-900/50">
          A
        </div>
        <div>
          <h2 className="text-white font-black text-lg">Admin</h2>
          <p className="text-xs text-gray-500 font-medium">Control Panel</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {adminSidebarItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-600 pl-3 shadow-[inset_0_0_10px_rgba(99,102,241,0.05)]"
                  : "hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <span
                className={
                  isActive ? "text-indigo-500" : "group-hover:text-white"
                }
              >
                <item.icon size={20} />
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

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
