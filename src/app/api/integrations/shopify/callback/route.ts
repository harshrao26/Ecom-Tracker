import { NextRequest, NextResponse } from "next/server";
import ShopifyClient from "@/lib/integrations/shopify/client";
import connectDB from "@/lib/db/connection";
import Store from "@/lib/db/models/Store";
import User from "@/lib/db/models/User";

/**
 * GET /api/integrations/shopify/callback
 * Handle Shopify OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const shop = searchParams.get("shop");
    const stateParam = searchParams.get("state");

    if (!code || !shop || !stateParam) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Decode state to get userId
    const {
      state,
      userId,
      shop: originalShop,
    } = JSON.parse(Buffer.from(stateParam, "base64").toString());

    // Verify shop matches
    if (shop !== originalShop) {
      return NextResponse.json(
        { error: "Shop mismatch - possible CSRF attack" },
        { status: 400 },
      );
    }

    // Exchange code for access token
    const accessToken = await ShopifyClient.exchangeCodeForToken(shop, code);

    // Get shop info
    const shopInfo = await ShopifyClient.getShopInfo(shop, accessToken);

    // Check if store already exists
    let store = await Store.findOne({
      userId,
      platform: "shopify",
      platformStoreId: shopInfo.id.toString(),
    });

    if (store) {
      // Update existing store
      store.saveEncryptedCredentials({
        accessToken,
        shopUrl: shop,
      });
      store.isActive = true;
      store.syncStatus.status = "pending";
      store.scheduleNextSync();
    } else {
      // Create new store
      store = new Store({
        userId,
        name: shopInfo.name,
        platform: "shopify",
        platformStoreId: shopInfo.id.toString(),
        currency: shopInfo.currency,
        timezone: shopInfo.iana_timezone,
        country: shopInfo.country_code,
      });

      store.saveEncryptedCredentials({
        accessToken,
        shopUrl: shop,
      });

      store.scheduleNextSync();

      // Add store to user's connected stores
      await User.findByIdAndUpdate(userId, {
        $addToSet: { connectedStores: store._id },
      });
    }

    await store.save();

    // Register webhooks
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
      } catch (error) {
        console.error(`❌ Failed to register webhook ${webhook.topic}`);
      }
    }

    // Redirect to success page or dashboard
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?success=true&platform=shopify`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("❌ Error in Shopify OAuth callback:", error);

    const errorUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=true&message=${encodeURIComponent(error instanceof Error ? error.message : "Unknown error")}`;

    return NextResponse.redirect(errorUrl);
  }
}
