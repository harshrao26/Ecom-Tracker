"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  FiCreditCard,
  FiSearch,
  FiFilter,
  FiClock,
  FiMail,
  FiUser,
  FiArrowUpRight,
} from "react-icons/fi";

interface PendingOrder {
  _id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  plan: string;
  status: string;
  createdAt: string;
  razorpay_order_id: string;
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/payments/pending");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      order.razorpay_order_id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <FiCreditCard className="text-indigo-600" />
              Payment Tracking
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Monitor pending and abandoned checkouts for follow-up
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Pending Checkouts
              </div>
              <div className="text-3xl font-black text-gray-900">
                {orders.length}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Potential Revenue
              </div>
              <div className="text-3xl font-black text-indigo-600">
                ₹
                {orders
                  .reduce((acc, curr) => acc + curr.amount, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Time Period
              </div>
              <div className="text-sm font-bold text-gray-600">Last 7 Days</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Abandoned At
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-6 py-8">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                            <FiCreditCard size={24} />
                          </div>
                          <p className="text-sm font-bold text-gray-400">
                            No pending checkouts found
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                              {order.customerName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-black text-gray-900">
                                {order.customerName}
                              </div>
                              <div className="text-[10px] font-bold text-gray-400">
                                {order.customerEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-wider">
                            {order.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-black text-gray-900">
                            ₹{order.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 uppercase">
                            <FiClock size={12} />
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`mailto:${order.customerEmail}?subject=Complete your Online Planet setup&body=Hi ${order.customerName}, we noticed you were trying to upgrade to the ${order.plan} plan...`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-[10px] font-black uppercase tracking-widest"
                          >
                            <FiMail size={14} />
                            Follow Up
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
