import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/connection";
import Order from "@/lib/db/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      (session.role !== "admin" && session.role !== "super-admin")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    await connectDB();

    // Fetch pending orders from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingOrders = await Order.find({
      status: "pending",
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders: pendingOrders,
    });
  } catch (error: any) {
    console.error("Fetch pending orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pending orders" },
      { status: 500 },
    );
  }
}
