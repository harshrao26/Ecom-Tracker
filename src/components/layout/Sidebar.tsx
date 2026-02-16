"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBarChart2, FiLayers, FiLock, FiZap } from "react-icons/fi";
import { FaRegLightbulb } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Sidebar Auth Error:", error);
      }
    };
    fetchUser();
  }, []);

  const sidebarItems = [
    {
      id: "analytics",
      label: "Analytics",
      icon: FiBarChart2,
      path: "/dashboard",
      locked: false,
    },
    {
      id: "insights",
      label: "AI Insights",
      icon: FaRegLightbulb,
      path: "/dashboard/insights",
      locked: user && !user.limits?.aiInsights,
    },
    {
      id: "marketing",
      label: "Marketing ROI",
      icon: FiBarChart2,
      path: "/dashboard/marketing",
      locked: user && user.subscription.plan === "free",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: FiLayers,
      path: "/dashboard/integrations",
      locked: false,
    },
  ];

  return (
    <div className="w-64 bg-[#0A1020] h-screen fixed left-0 top-0 text-gray-400 flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
          <FiZap size={22} />
        </div>
        <span className="text-lg font-black text-white tracking-tight">
          Online Planet
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path;
          const isLocked = item.locked;

          const content = (
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : isLocked
                    ? "opacity-50 cursor-not-allowed grayscale-[0.5]"
                    : "hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <span
                className={isActive ? "text-white" : "group-hover:text-white"}
              >
                <item.icon size={18} />
              </span>
              <span className="text-sm font-bold tracking-tight">
                {item.label}
              </span>

              {isLocked && (
                <div className="ml-auto">
                  <FiLock size={14} className="text-gray-500" />
                </div>
              )}

              {!isLocked && isActive && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
              )}
            </div>
          );

          if (isLocked) {
            return (
              <div key={item.id} title="Upgrade plan to unlock this feature">
                {content}
              </div>
            );
          }

          return (
            <Link key={item.id} href={item.path}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Plan Info Badge */}
      {user && (
        <div className="p-4 mt-auto border-t border-gray-800/50">
          <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Active Plan
              </span>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  user.subscription.plan === "enterprise"
                    ? "bg-purple-500/20 text-purple-400"
                    : user.subscription.plan === "growth"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {user.subscription.plan}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${user.subscription.plan === "enterprise" ? 100 : user.subscription.plan === "growth" ? 75 : 40}%`,
                }}
              />
            </div>
            <Link
              href="/#pricing"
              className="mt-3 block text-center text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      )}

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
