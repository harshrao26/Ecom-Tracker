import { NextRequest, NextResponse } from "next/server";
import ShopifyClient from "@/lib/integrations/shopify/client";
import ShopifyTransformer from "@/lib/integrations/shopify/transformer";
import connectDB from "@/lib/db/connection";
import Store from "@/lib/db/models/Store";
import AnalyticsData from "@/lib/db/models/AnalyticsData";

/**
 * POST /api/webhooks/shopify/orders
 * Handle Shopify order webhooks (orders/create, orders/updated)
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for HMAC verification
    const body = await request.text();
    const hmac = request.headers.get("X-Shopify-Hmac-Sha256");
    const shop = request.headers.get("X-Shopify-Shop-Domain");
    const topic = request.headers.get("X-Shopify-Topic");

    if (!hmac || !shop) {
      console.error("❌ Missing webhook headers");
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = ShopifyClient.verifyWebhook(body, hmac);
    if (!isValid) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    await connectDB();

    // Parse order data
    const orderData = JSON.parse(body);
    console.log(`📦 Received ${topic} webhook for order ${orderData.id}`);

    // Find the store
    const store = await Store.findOne({
      platform: "shopify",
      "credentials.shopUrl": shop,
      isActive: true,
    });

    if (!store) {
      console.error("❌ Store not found for shop:", shop);
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Transform order to our format
    const transformedOrder = ShopifyTransformer.transformOrder(
      orderData,
      store._id.toString(),
    );

    // Get today's date for daily snapshot
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update or create analytics data for today
    await AnalyticsData.findOneAndUpdate(
      {
        storeId: store._id,
        date: today,
      },
      {
        $pull: {
          orders: { platformOrderId: transformedOrder.platformOrderId },
        },
      },
    );

    // Now add the updated order
    await AnalyticsData.findOneAndUpdate(
      {
        storeId: store._id,
        date: today,
      },
      {
        $push: { orders: transformedOrder },
        $setOnInsert: { products: [], customers: [] },
      },
      {
        upsert: true,
      },
    );

    console.log(`✅ Order ${orderData.id} synced successfully`);

    return NextResponse.json({
      success: true,
      message: "Order synced successfully",
    });
  } catch (error) {
    console.error("❌ Error processing order webhook:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
