"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { FiSettings, FiFileText, FiFilter, FiDownload } from "react-icons/fi";

interface AuditLog {
  _id: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  timestamp: string;
}

interface ActionStat {
  _id: string;
  count: number;
}

export default function AdminSettingsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [actionStats, setActionStats] = useState<ActionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    fetchAuditLogs();
  }, [page, actionFilter, resourceFilter, dateRange]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(actionFilter && { action: actionFilter }),
        ...(resourceFilter && { resource: resourceFilter }),
      });

      // Add date range
      if (dateRange !== "all") {
        const endDate = new Date();
        const startDate = new Date();

        if (dateRange === "24h") {
          startDate.setHours(startDate.getHours() - 24);
        } else if (dateRange === "7d") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (dateRange === "30d") {
          startDate.setDate(startDate.getDate() - 30);
        }

        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      }

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setActionStats(data.data.stats.actionBreakdown);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatActionName = (action: string) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    if (action.includes("UPDATE")) return "bg-blue-100 text-blue-700";
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("EXPORT")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <FiSettings className="text-gray-600" />
              Admin Settings
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Audit logs and system configuration
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mb-6">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">
              <FiFileText className="inline-block mr-2" size={16} />
              Audit Logs
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200">
              General
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200">
              Security
            </button>
          </div>

          {/* Stats */}
          {actionStats.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Top Actions (Last {dateRange === "all" ? "All Time" : dateRange}
                )
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {actionStats.slice(0, 5).map((stat) => (
                  <div key={stat._id} className="text-center">
                    <div className="text-2xl font-black text-gray-900">
                      {stat.count}
                    </div>
                    <div className="text-xs font-medium text-gray-500 mt-1">
                      {formatActionName(stat._id)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Action Filter */}
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Actions</option>
                <option value="CREATE_USER">Create User</option>
                <option value="UPDATE_USER">Update User</option>
                <option value="DELETE_USER">Delete User</option>
                <option value="SUSPEND_USER">Suspend User</option>
                <option value="EXPORT_USERS_CSV">Export Users</option>
                <option value="ADMIN_LOGIN">Admin Login</option>
              </select>

              {/* Resource Filter */}
              <select
                value={resourceFilter}
                onChange={(e) => {
                  setResourceFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Resources</option>
                <option value="User">User</option>
                <option value="Order">Order</option>
                <option value="Product">Product</option>
                <option value="Session">Session</option>
              </select>

              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No audit logs found
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {log.adminEmail}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${getActionColor(log.action)}`}
                          >
                            {formatActionName(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.resource}
                          {log.resourceId && (
                            <span className="text-gray-400 ml-2">
                              #{log.resourceId.slice(-6)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
