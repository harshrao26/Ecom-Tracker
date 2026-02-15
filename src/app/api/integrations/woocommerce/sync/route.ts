import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import WooCommerceSyncService from "@/lib/integrations/woocommerce/sync";
import Store from "@/lib/db/models/Store";

/**
 * POST /api/integrations/woocommerce/sync
 * Trigger manual sync for a WooCommerce store
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId is required" },
        { status: 400 },
      );
    }

    // Verify store exists and is WooCommerce
    const store = await Store.findById(storeId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store.platform !== "woocommerce") {
      return NextResponse.json(
        { error: "Store is not a WooCommerce store" },
        { status: 400 },
      );
    }

    if (!store.isActive) {
      return NextResponse.json(
        { error: "Store is not active" },
        { status: 400 },
      );
    }

    // Check if already syncing
    if (store.syncStatus.status === "syncing") {
      return NextResponse.json(
        { error: "Store is already syncing", syncStatus: store.syncStatus },
        { status: 409 },
      );
    }

    // Trigger sync
    console.log(
      `🔄 Starting manual sync for WooCommerce store ${store.name}...`,
    );

    const result = await WooCommerceSyncService.syncStore(storeId);

    return NextResponse.json({
      success: true,
      message: "Sync completed successfully",
      result,
      store: {
        id: store._id,
        name: store.name,
        lastSync: store.syncStatus.lastSync,
        nextSync: store.syncStatus.nextSync,
      },
    });
  } catch (error) {
    console.error("❌ Error in WooCommerce manual sync:", error);

    return NextResponse.json(
      {
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/integrations/woocommerce/sync
 * Get sync status for a WooCommerce store
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId is required" },
        { status: 400 },
      );
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({
      syncStatus: store.syncStatus,
      settings: store.settings,
    });
  } catch (error) {
    console.error("❌ Error fetching WooCommerce sync status:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
