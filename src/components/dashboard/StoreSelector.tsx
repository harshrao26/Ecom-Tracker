/**
 * StoreSelector Component
 * Dropdown to select store for filtering
 */

"use client";

import { useState, useEffect } from "react";

interface StoreSelectorProps {
  value: string;
  onChange: (value: string) => void;
  userId: string;
}

export default function StoreSelector({
  value,
  onChange,
  userId,
}: StoreSelectorProps) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, [userId]);

  async function fetchStores() {
    try {
      // Fetch from all platform integration endpoints
      const [shopifyRes, wooRes] = await Promise.all([
        fetch(`/api/integrations/shopify?userId=${userId}`).catch(() => null),
        fetch(`/api/integrations/woocommerce?userId=${userId}`).catch(
          () => null,
        ),
      ]);

      const allStores: any[] = [];

      if (shopifyRes && shopifyRes.ok) {
        const shopifyData = await shopifyRes.json();
        if (shopifyData.stores) {
          allStores.push(
            ...shopifyData.stores.map((s: any) => ({
              ...s,
              platform: "Shopify",
            })),
          );
        }
      }

      if (wooRes && wooRes.ok) {
        const wooData = await wooRes.json();
        if (wooData.stores) {
          allStores.push(
            ...wooData.stores.map((s: any) => ({
              ...s,
              platform: "WooCommerce",
            })),
          );
        }
      }

      setStores(allStores);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
        Loading stores...
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
    >
      <option value="all">All Stores</option>
      {stores.map((store) => (
        <option key={store.id} value={store.id}>
          {store.name} ({store.platform})
        </option>
      ))}
    </select>
  );
}
