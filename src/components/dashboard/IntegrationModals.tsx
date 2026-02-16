"use client";

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { SiShopify, SiWoocommerce } from "react-icons/si";

interface ShopifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ShopifyConnectionModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ShopifyModalProps) => {
  const [shop, setShop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setShop("");
      setLoading(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/integrations/shopify?shop=${shop}`);
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setError(data.error || "Failed to initiate Shopify connection");
      }
    } catch (err) {
      setError("Error connecting to Shopify. Please check your domain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl scale-up-center group">
        <div className="bg-[#96bf48] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 hover:rotate-90 transition-transform"
          >
            <FiPlus className="rotate-45" size={24} />
          </button>
          <SiShopify size={48} className="mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Shopify Connection</h2>
          <p className="text-gray-800/80 text-sm mt-1">Connect your store using official Shopify OAuth.</p>
        </div>

        <div className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
              <FiAlertCircle />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Enter Shop Name</h4>
                <p className="text-xs text-gray-500 mt-1">Provide your unique `.myshopify.com` domain.</p>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="your-store.myshopify.com"
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#96bf48]/50 outline-none transition-all"
                      value={shop}
                      onChange={(e) => setShop(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#96bf48] hover:bg-[#85ab40] text-gray-900 px-6 rounded-xl font-bold text-sm transition-all shadow-md truncate"
                    >
                      {loading ? <FiRefreshCw className="animate-spin" /> : "Begin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Review Permissions</h4>
                <p className="text-xs text-gray-500 mt-1">You'll be redirected to Shopify's secure authorization page.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
            <FiCheckCircle className="text-green-600 mt-0.5" size={16} />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <strong>Secure Integration:</strong> We huse official Shopify APIs and never store customer data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface WooCommerceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WooCommerceConnectionModal = ({
  isOpen,
  onClose,
  onSuccess,
}: WooCommerceModalProps) => {
  const [form, setForm] = useState({
    siteUrl: "",
    consumerKey: "",
    consumerSecret: "",
    storeName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setForm({
        siteUrl: "",
        consumerKey: "",
        consumerSecret: "",
        storeName: "",
      });
      setLoading(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/integrations/woocommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Failed to connect WooCommerce store");
      }
    } catch (err) {
      setError("Error connecting to WooCommerce. Check server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl scale-up-center flex flex-col md:flex-row">
        {/* Left: Instructions */}
        <div className="md:w-1/2 bg-[#96588a] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 hover:rotate-90 transition-transform md:hidden"
          >
            <FiPlus className="rotate-45" size={24} />
          </button>
          <SiWoocommerce size={48} className="mb-6" />
          <h2 className="text-2xl font-bold mb-2">WooCommerce Guide</h2>
          <p className="text-purple-100/70 text-sm mb-8 font-medium">Follow these steps in your WordPress admin to connect.</p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div>
                <h4 className="font-bold text-white text-sm">Open Settings</h4>
                <p className="text-xs text-purple-100/60 mt-1">Go to <strong>WooCommerce → Settings → Advanced</strong>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div>
                <h4 className="font-bold text-white text-sm">Create API Key</h4>
                <p className="text-xs text-purple-100/60 mt-1">Click on <strong>REST API</strong> and then <strong>"Add Key"</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:w-1/2 p-8 bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 hover:rotate-90 transition-transform hidden md:block text-gray-400"
          >
            <FiPlus className="rotate-45" size={24} />
          </button>

          <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider">Store Credentials</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                <FiAlertCircle />
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
              <input
                type="text"
                required
                placeholder="Fashion Hub"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#96588a]/50 outline-none transition-all"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Website URL</label>
              <input
                type="url"
                required
                placeholder="https://myshop.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#96588a]/50 outline-none transition-all"
                value={form.siteUrl}
                onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <input
                type="password"
                required
                placeholder="Consumer Key"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#96588a]/50 outline-none transition-all"
                value={form.consumerKey}
                onChange={(e) => setForm({ ...form, consumerKey: e.target.value })}
              />
              <input
                type="password"
                required
                placeholder="Consumer Secret"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#96588a]/50 outline-none transition-all"
                value={form.consumerSecret}
                onChange={(e) => setForm({ ...form, consumerSecret: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#96588a] hover:bg-[#7e4a74] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : "Connect Store"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
