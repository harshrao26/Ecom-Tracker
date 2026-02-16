import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Store from "@/lib/db/models/Store";
import { getSession } from "@/lib/auth";

/**
 * GET /api/stores
 * Get all connected stores for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    await connectDB();

    const stores = await Store.find({
      userId,
      isActive: true,
    }).select(
      "name platform platformStoreId syncStatus settings currency createdAt",
    );

    return NextResponse.json({
      success: true,
      stores: stores.map((s) => ({
        id: s._id,
        name: s.name,
        platform: s.platform,
        platformStoreId: s.platformStoreId,
        syncStatus: s.syncStatus,
        settings: s.settings,
        currency: s.currency,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching stores:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
