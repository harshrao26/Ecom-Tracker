import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import ShopifyClient from "@/lib/integrations/shopify/client";
import connectDB from "@/lib/db/connection";
import Store from "@/lib/db/models/Store";

/**
 * GET /api/integrations/shopify
 * Initiate Shopify OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shop = searchParams.get("shop");
    const userId = searchParams.get("userId");

    if (!shop || !userId) {
      return NextResponse.json(
        { error: "Shop and userId are required" },
        { status: 400 },
      );
    }

    // Validate shop format (should be mystore.myshopify.com)
    if (!shop.includes(".myshopify.com")) {
      return NextResponse.json(
        {
          error:
            "Invalid shop format. Must be in format: mystore.myshopify.com",
        },
        { status: 400 },
      );
    }

    // Generate state token for CSRF protection
    const state = crypto.randomBytes(32).toString("hex");

    // Store state in session/database temporarily
    // For now, we'll encode userId in state (in production, use proper session storage)
    const stateWithUser = Buffer.from(
      JSON.stringify({ state, userId, shop }),
    ).toString("base64");

    // Generate OAuth URL
    const authUrl = ShopifyClient.generateAuthUrl(shop, stateWithUser);

    return NextResponse.json({
      authUrl,
      message: "Redirect user to this URL to authorize",
    });
  } catch (error) {
    console.error("❌ Error in Shopify integration:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/integrations/shopify
 * Manual store connection (without OAuth, for testing)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, shop, accessToken, storeName } = body;

    if (!userId || !shop || !accessToken) {
      return NextResponse.json(
        { error: "userId, shop, and accessToken are required" },
        { status: 400 },
      );
    }

    // Verify the access token by fetching shop info
    const shopInfo = await ShopifyClient.getShopInfo(shop, accessToken);

    // Create store in database
    const store = new Store({
      userId,
      name: storeName || shopInfo.name,
      platform: "shopify",
      platformStoreId: shopInfo.id.toString(),
      currency: shopInfo.currency,
      timezone: shopInfo.iana_timezone,
      country: shopInfo.country_code,
    });

    // Encrypt and save credentials
    store.saveEncryptedCredentials({
      accessToken,
      shopUrl: shop,
    });

    store.scheduleNextSync();
    await store.save();

    // Register webhooks
    await registerShopifyWebhooks(shop, accessToken);

    return NextResponse.json({
      success: true,
      message: "Shopify store connected successfully",
      store: {
        id: store._id,
        name: store.name,
        platform: store.platform,
        syncStatus: store.syncStatus,
      },
    });
  } catch (error) {
    console.error("❌ Error connecting Shopify store:", error);

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
 * Helper function to register webhooks
 */
async function registerShopifyWebhooks(shop: string, accessToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const webhooks = [
    {
      topic: "orders/create",
      address: `${baseUrl}/api/webhooks/shopify/orders`,
    },
    {
      topic: "orders/updated",
      address: `${baseUrl}/api/webhooks/shopify/orders`,
    },
    {
      topic: "products/create",
      address: `${baseUrl}/api/webhooks/shopify/products`,
    },
    {
      topic: "products/update",
      address: `${baseUrl}/api/webhooks/shopify/products`,
    },
  ];

  for (const webhook of webhooks) {
    try {
      await ShopifyClient.registerWebhook(
        shop,
        accessToken,
        webhook.topic,
        webhook.address,
      );
      console.log(`✅ Registered webhook: ${webhook.topic}`);
    } catch (error) {
      console.error(`❌ Failed to register webhook ${webhook.topic}:`, error);
    }
  }
}
