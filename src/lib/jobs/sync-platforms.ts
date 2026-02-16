/**
 * Background Sync Coordinator
 * Orchestrates synchronization across all connected platforms
 */

import Store from "@/lib/db/models/Store";
import { ShopifySyncService } from "@/lib/integrations/shopify/sync";
import { WooCommerceSyncService } from "@/lib/integrations/woocommerce/sync";

export async function syncAllStores() {
  console.log("🚀 Starting global store synchronization...");

  try {
    // Find active stores that are due for sync or have never been synced
    const now = new Date();
    const activeStores = await Store.find({
      isActive: true,
      "settings.autoSync": true,
      $or: [
        { "syncStatus.nextSync": { $lte: now } },
        { "syncStatus.nextSync": { $exists: false } },
        { "syncStatus.status": { $ne: "syncing" } },
      ],
    });

    console.log(
      `🔍 Found ${activeStores.length} stores due for synchronization.`,
    );

    for (const store of activeStores) {
      try {
        console.log(`⏳ Processing store: ${store.name} (${store.platform})`);

        switch (store.platform) {
          case "shopify":
            await ShopifySyncService.syncStore(store._id.toString());
            break;
          case "woocommerce":
            await WooCommerceSyncService.syncStore(store._id.toString());
            break;
          case "amazon":
            console.log("⚠️ Amazon sync not yet implemented. Skipping...");
            break;
          case "flipkart":
            console.log("⚠️ Flipkart sync not yet implemented. Skipping...");
            break;
          default:
            console.log(
              `❓ Unsupported platform: ${store.platform}. Skipping...`,
            );
        }
      } catch (error) {
        console.error(`❌ Global sync failed for store ${store.name}:`, error);
        // Error handling is already managed within individual sync services
      }
    }

    console.log("🏁 Global store synchronization completed.");
  } catch (error) {
    console.error("❌ Critical error in syncAllStores:", error);
  }
}
