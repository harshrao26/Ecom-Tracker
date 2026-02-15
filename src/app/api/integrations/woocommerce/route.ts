import { NextRequest, NextResponse } from "next/server";
import WooCommerceClient from "@/lib/integrations/woocommerce/client";
import connectDB from "@/lib/db/connection";
import Store from "@/lib/db/models/Store";
import User from "@/lib/db/models/User";

/**
 * POST /api/integrations/woocommerce
 * Connect WooCommerce store
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, siteUrl, consumerKey, consumerSecret, storeName } = body;

    if (!userId || !siteUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        {
          error:
            "userId, siteUrl, consumerKey, and consumerSecret are required",
        },
        { status: 400 },
      );
    }

    // Validate site URL format
    let formattedUrl = siteUrl.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    // Create WooCommerce client
    const client = new WooCommerceClient(
      formattedUrl,
      consumerKey,
      consumerSecret,
    );

    // Validate credentials by fetching system status
    const isValid = await client.validateCredentials();
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid WooCommerce credentials" },
        { status: 401 },
      );
    }

    // Get store settings
    const settings = await client.getSettings();

    // Check if store already exists
    const existingStore = await Store.findOne({
      userId,
      platform: "woocommerce",
      "credentials.siteUrl": formattedUrl,
    });

    let store;

    if (existingStore) {
      // Update existing store credentials
      store = existingStore;
      store.saveEncryptedCredentials({
        siteUrl: formattedUrl,
        consumerKey,
        consumerSecret,
      });
      store.isActive = true;
      store.syncStatus.status = "pending";
      store.scheduleNextSync();
    } else {
      // Create new store
      store = new Store({
        userId,
        name: storeName || settings[0]?.value || "WooCommerce Store",
        platform: "woocommerce",
        platformStoreId: formattedUrl, // WooCommerce doesn't have store IDs, use URL
        currency: "INR", // Default, can be updated from settings
        timezone: "Asia/Kolkata",
        country: "IN",
      });

      store.saveEncryptedCredentials({
        siteUrl: formattedUrl,
        consumerKey,
        consumerSecret,
      });

      store.scheduleNextSync();

      // Add store to user's connected stores
      await User.findByIdAndUpdate(userId, {
        $addToSet: { connectedStores: store._id },
      });
    }

    await store.save();

    return NextResponse.json({
      success: true,
      message: "WooCommerce store connected successfully",
      store: {
        id: store._id,
        name: store.name,
        platform: store.platform,
        siteUrl: formattedUrl,
        syncStatus: store.syncStatus,
      },
    });
  } catch (error) {
    console.error("❌ Error connecting WooCommerce store:", error);

    return NextResponse.json(
      {
        error: "Failed to connect store",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/integrations/woocommerce
 * Get connected WooCommerce stores for a user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const stores = await Store.find({
      userId,
      platform: "woocommerce",
      isActive: true,
    }).select("name platformStoreId syncStatus settings createdAt");

    return NextResponse.json({
      success: true,
      stores: stores.map((s) => ({
        id: s._id,
        name: s.name,
        siteUrl: s.platformStoreId,
        syncStatus: s.syncStatus,
        settings: s.settings,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching WooCommerce stores:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
