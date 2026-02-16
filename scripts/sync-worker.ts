/**
 * Background Sync Worker
 * Standalone script to run periodic synchronization jobs
 */

import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local IMMEDIATELY
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

console.log("🔄 Background Sync Worker starting...");

async function runWorker() {
  try {
    // Dynamic imports to ensure dotenv.config() has run first
    const cron = (await import("node-cron")).default;
    const connectDB = (await import("../src/lib/db/connection")).default;
    const { syncAllStores } = await import("../src/lib/jobs/sync-platforms");

    // 1. Connect to Database
    await connectDB();
    console.log("📡 Connected to MongoDB");

    // 2. Run initial sync on startup
    console.log("🚀 Running initial startup synchronization...");
    await syncAllStores();

    // 3. Schedule periodic sync (Every 1 hour)
    // Minute 0 of every hour
    cron.schedule("0 * * * *", async () => {
      console.log(
        `⏰ Scheduled sync triggered at: ${new Date().toISOString()}`,
      );
      await syncAllStores();
    });

    console.log("✅ Worker is now monitoring and scheduled for hourly syncs.");
    console.log("Press Ctrl+C to stop the worker.");
  } catch (error) {
    console.error("❌ Critical error in sync worker:", error);
    process.exit(1);
  }
}

// Handle signals for clean exit
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping worker...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Terminating worker...");
  process.exit(0);
});

// Start the worker
runWorker();
