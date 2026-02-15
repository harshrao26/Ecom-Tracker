/**
 * Shopify Sync Service
 * Handles batch synchronization of Shopify data
 */

import ShopifyClient from "./client";
import ShopifyTransformer from "./transformer";
import Store from "@/lib/db/models/Store";
import AnalyticsData from "@/lib/db/models/AnalyticsData";

export class ShopifySyncService {
  /**
   * Sync all data for a Shopify store
   */
  static async syncStore(storeId: string) {
    const store = await Store.findById(storeId);

    if (!store || store.platform !== "shopify") {
      throw new Error("Invalid store or platform");
    }

    // Update sync status
    store.syncStatus.status = "syncing";
    await store.save();

    try {
      // Get decrypted credentials
      const credentials = store.getDecryptedCredentials();
      if (!credentials || !credentials.accessToken || !credentials.shopUrl) {
        throw new Error("Missing store credentials");
      }

      const { accessToken, shopUrl } = credentials;

      // Calculate date range (last 90 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      console.log(`🔄 Starting sync for store ${store.name}...`);

      // Sync orders, products, and customers in parallel
      const [orders, products, customers] = await Promise.all([
        this.syncOrders(shopUrl, accessToken, startDate, endDate),
        this.syncProducts(shopUrl, accessToken),
        this.syncCustomers(shopUrl, accessToken),
      ]);

      console.log(
        `✅ Synced ${orders.length} orders, ${products.length} products, ${customers.length} customers`,
      );

      // Transform data
      const transformedOrders = ShopifyTransformer.transformOrders(
        orders,
        storeId,
      );
      const transformedProducts =
        ShopifyTransformer.transformProducts(products);
      const transformedCustomers =
        ShopifyTransformer.transformCustomers(customers);

      // Group orders by date
      const ordersByDate = new Map<string, any[]>();
      transformedOrders.forEach((order) => {
        const dateKey = new Date(order.date).toISOString().split("T")[0];
        if (!ordersByDate.has(dateKey)) {
          ordersByDate.set(dateKey, []);
        }
        ordersByDate.get(dateKey)!.push(order);
      });

      // Save to database (one document per day)
      for (const [dateKey, dayOrders] of ordersByDate.entries()) {
        const date = new Date(dateKey);

        await AnalyticsData.findOneAndUpdate(
          { storeId, date },
          {
            $set: {
              orders: dayOrders,
              products: transformedProducts,
              customers: transformedCustomers,
            },
          },
          { upsert: true },
        );
      }

      // Update sync status
      store.syncStatus.status = "active";
      store.syncStatus.lastSync = new Date();
      store.syncStatus.lastSyncedOrderCount = orders.length;
      store.scheduleNextSync();
      await store.save();

      console.log(`✅ Sync completed for store ${store.name}`);

      return {
        success: true,
        ordersCount: orders.length,
        productsCount: products.length,
        customersCount: customers.length,
      };
    } catch (error) {
      // Update sync status with error
      store.syncStatus.status = "error";
      store.syncStatus.errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await store.save();

      console.error(`❌ Sync failed for store ${store.name}:`, error);

      throw error;
    }
  }

  /**
   * Sync orders from Shopify
   */
  private static async syncOrders(
    shop: string,
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ) {
    const allOrders: any[] = [];
    let hasMore = true;
    let lastId: string | undefined;

    // Paginate through orders (250 per page)
    while (hasMore) {
      const orders = await ShopifyClient.fetchOrders(shop, accessToken, {
        limit: 250,
        sinceId: lastId,
        createdAtMin: startDate.toISOString(),
        createdAtMax: endDate.toISOString(),
        status: "any",
      });

      allOrders.push(...orders);

      if (orders.length < 250) {
        hasMore = false;
      } else {
        lastId = orders[orders.length - 1].id.toString();
      }

      console.log(`📥 Fetched ${allOrders.length} orders so far...`);
    }

    return allOrders;
  }

  /**
   * Sync products from Shopify
   */
  private static async syncProducts(shop: string, accessToken: string) {
    const allProducts: any[] = [];
    let hasMore = true;
    let lastId: string | undefined;

    // Paginate through products (250 per page)
    while (hasMore) {
      const products = await ShopifyClient.fetchProducts(shop, accessToken, {
        limit: 250,
        sinceId: lastId,
      });

      allProducts.push(...products);

      if (products.length < 250) {
        hasMore = false;
      } else {
        lastId = products[products.length - 1].id.toString();
      }

      console.log(`📥 Fetched ${allProducts.length} products so far...`);
    }

    return allProducts;
  }

  /**
   * Sync customers from Shopify
   */
  private static async syncCustomers(shop: string, accessToken: string) {
    const allCustomers: any[] = [];
    let hasMore = true;
    let lastId: string | undefined;

    // Paginate through customers (250 per page)
    while (hasMore) {
      const customers = await ShopifyClient.fetchCustomers(shop, accessToken, {
        limit: 250,
        sinceId: lastId,
      });

      allCustomers.push(...customers);

      if (customers.length < 250) {
        hasMore = false;
      } else {
        lastId = customers[customers.length - 1].id.toString();
      }

      console.log(`📥 Fetched ${allCustomers.length} customers so far...`);
    }

    return allCustomers;
  }
}

export default ShopifySyncService;
