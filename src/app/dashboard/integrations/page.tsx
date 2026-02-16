"use client";

import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiRefreshCw,
  FiLink,
  FiLayers,
  FiShoppingBag,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import { SiShopify, SiWoocommerce, SiAmazon, SiFlipkart } from "react-icons/si";
import { 
  ShopifyConnectionModal, 
  WooCommerceConnectionModal 
} from "@/components/dashboard/IntegrationModals";

interface Store {
  id: string;
  name: string;
  platform: string;
  platformStoreId: string;
  syncStatus: {
    status: string;
    lastSync?: string;
    errorMessage?: string;
  };
  createdAt: string;
}

const platforms = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Connect your Shopify store via OAuth.",
    icon: SiShopify,
    color: "bg-[#96bf48]",
    textColor: "text-[#96bf48]",
    bgHover: "hover:bg-[#96bf48]/10",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Connect your WordPress store using REST API.",
    icon: SiWoocommerce,
    color: "bg-[#96588a]",
    textColor: "text-[#96588a]",
    bgHover: "hover:bg-[#96588a]/10",
  },
  {
    id: "amazon",
    name: "Amazon Central",
    description: "Integrate with Amazon Seller Central (SP-API).",
    icon: SiAmazon,
    color: "bg-[#FF9900]",
    textColor: "text-[#FF9900]",
    bgHover: "hover:bg-[#FF9900]/10",
    isComingSoon: true,
  },
  {
    id: "flipkart",
    name: "Flipkart Seller",
    description: "Sync your Flipkart Seller Hub data.",
    icon: SiFlipkart,
    color: "bg-[#2874F0]",
    textColor: "text-[#2874F0]",
    bgHover: "hover:bg-[#2874F0]/10",
    isComingSoon: true,
  },
];

export default function IntegrationsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showWooModal, setShowWooModal] = useState(false);
  const [showShopifyModal, setShowShopifyModal] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stores");
      const data = await res.json();
      if (data.stores) {
        setStores(data.stores);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const syncAll = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      fetchStores();
    }, 2000);
  };

  const handleWooSuccess = () => {
    setShowWooModal(false);
    fetchStores();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in transition-all">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 mb-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FiLayers size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
            Store Integrations
          </h1>
          <p className="text-blue-100 max-w-2xl text-lg font-medium opacity-90">
            Connect your platforms to centralize business analytics in one premium dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={syncAll}
              disabled={isSyncing}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
            >
              <FiRefreshCw className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Manual Sync"}
            </button>
            <div className="bg-green-500/20 backdrop-blur-md text-green-300 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 border border-green-500/30">
              <FiCheckCircle />
              Secure Tunnel Active
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiLink className="text-blue-600" />
              Available Integration Platforms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 ${platform.bgHover} ${platform.isComingSoon ? "opacity-75" : "hover:shadow-md hover:-translate-y-1"}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${platform.color} p-4 rounded-2xl text-white shadow-lg transition-transform`}>
                      <platform.icon size={28} />
                    </div>
                    {platform.isComingSoon ? (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                        Ready
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{platform.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {platform.description}
                  </p>
                  {!platform.isComingSoon && (
                    <button
                      onClick={() => platform.id === "shopify" ? setShowShopifyModal(true) : setShowWooModal(true)}
                      className={`w-full py-3 rounded-xl border border-gray-200 text-sm font-bold transition-all hover:bg-gray-900 hover:text-white flex items-center justify-center gap-2`}
                    >
                      Connect {platform.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiShoppingBag className="text-blue-600" />
              Connected Stores ({stores.length})
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-bottom border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Store</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Platform</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                     <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                          <FiRefreshCw className="inline animate-spin mr-2" />
                          Loading stores...
                        </td>
                      </tr>
                  ) : stores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        No stores connected yet.
                      </td>
                    </tr>
                  ) : (
                    stores.map((store) => (
                      <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{store.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{store.platformStoreId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-sm font-medium text-gray-700 flex items-center gap-2">
                            {store.platform === "shopify" && <SiShopify className="text-[#96bf48]" />}
                            {store.platform === "woocommerce" && <SiWoocommerce className="text-[#96588a]" />}
                            {store.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${store.syncStatus.status === "active" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
                            <span className="text-xs font-bold uppercase tracking-widest">
                              {store.syncStatus.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <FiSettings size={150} />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-blue-400" />
              Security First
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              All credentials are encrypted using AES-256-CBC with per-store rotation. We never store sensitive customer data.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Guide</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex gap-3">
                <span className="font-black text-blue-600">01</span>
                Select platform and authorize access.
              </li>
              <li className="flex gap-3">
                <span className="font-black text-blue-600">02</span>
                Automated background sync will start.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Connection Modals */}
      <ShopifyConnectionModal 
        isOpen={showShopifyModal}
        onClose={() => setShowShopifyModal(false)}
      />

      <WooCommerceConnectionModal 
        isOpen={showWooModal}
        onClose={() => setShowWooModal(false)}
        onSuccess={handleWooSuccess}
      />
    </div>
  );
}
