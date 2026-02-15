/**
 * WooCommerce Sync Service
 * Handles batch synchronization of WooCommerce data
 */

import WooCommerceClient from "./client";
import WooCommerceTransformer from "./transformer";
import Store from "@/lib/db/models/Store";
import AnalyticsData from "@/lib/db/models/AnalyticsData";

export class WooCommerceSyncService {
  /**
   * Sync all data for a WooCommerce store
   */
  static async syncStore(storeId: string) {
    const store = await Store.findById(storeId);

    if (!store || store.platform !== "woocommerce") {
      throw new Error("Invalid store or platform");
    }

    // Update sync status
    store.syncStatus.status = "syncing";
    await store.save();

    try {
      // Get decrypted credentials
      const credentials = store.getDecryptedCredentials();
      if (
        !credentials ||
        !credentials.siteUrl ||
        !credentials.consumerKey ||
        !credentials.consumerSecret
      ) {
        throw new Error("Missing store credentials");
      }

      const { siteUrl, consumerKey, consumerSecret } = credentials;

      // Create WooCommerce client
      const client = new WooCommerceClient(
        siteUrl,
        consumerKey,
        consumerSecret,
      );

      // Calculate date range (last 90 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      console.log(`🔄 Starting WooCommerce sync for store ${store.name}...`);

      // Sync orders, products, and customers in parallel
      const [orders, products, customers] = await Promise.all([
        this.syncOrders(client, startDate, endDate),
        this.syncProducts(client),
        this.syncCustomers(client),
      ]);

      console.log(
        `✅ Synced ${orders.length} orders, ${products.length} products, ${customers.length} customers`,
      );

      // Transform data
      const transformedOrders = WooCommerceTransformer.transformOrders(
        orders,
        storeId,
      );
      const transformedProducts =
        WooCommerceTransformer.transformProducts(products);
      const transformedCustomers =
        WooCommerceTransformer.transformCustomers(customers);

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
   * Sync orders from WooCommerce
   */
  private static async syncOrders(
    client: WooCommerceClient,
    startDate: Date,
    endDate: Date,
  ) {
    const allOrders: any[] = [];
    let page = 1;
    let hasMore = true;

    // Paginate through orders (100 per page)
    while (hasMore) {
      const orders = await client.fetchOrders({
        page,
        perPage: 100,
        after: startDate.toISOString(),
        before: endDate.toISOString(),
      });

      allOrders.push(...orders);

      if (orders.length < 100) {
        hasMore = false;
      } else {
        page++;
      }

      console.log(`📥 Fetched ${allOrders.length} orders so far...`);
    }

    return allOrders;
  }

  /**
   * Sync products from WooCommerce
   */
  private static async syncProducts(client: WooCommerceClient) {
    const allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // Paginate through products (100 per page)
    while (hasMore) {
      const products = await client.fetchProducts({
        page,
        perPage: 100,
      });

      allProducts.push(...products);

      if (products.length < 100) {
        hasMore = false;
      } else {
        page++;
      }

      console.log(`📥 Fetched ${allProducts.length} products so far...`);
    }

    return allProducts;
  }

  /**
   * Sync customers from WooCommerce
   */
  private static async syncCustomers(client: WooCommerceClient) {
    const allCustomers: any[] = [];
    let page = 1;
    let hasMore = true;

    // Paginate through customers (100 per page)
    while (hasMore) {
      const customers = await client.fetchCustomers({
        page,
        perPage: 100,
      });

      allCustomers.push(...customers);

      if (customers.length < 100) {
        hasMore = false;
      } else {
        page++;
      }

      console.log(`📥 Fetched ${allCustomers.length} customers so far...`);
    }

    return allCustomers;
  }
}

export default WooCommerceSyncService;
