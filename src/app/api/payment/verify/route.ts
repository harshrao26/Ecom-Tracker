import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/connection";
import Order from "@/lib/db/models/Order";
import User from "@/lib/db/models/User";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 },
      );
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new Error("RAZORPAY_KEY_SECRET is not defined");
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Update Order
    const order = await Order.findOne({ razorpay_order_id });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    order.status = "completed";
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.completedAt = new Date();
    await order.save();

    // 2. Update User Subscription
    const user = await User.findById(order.userId);
    if (user) {
      user.subscription.plan = order.plan.toLowerCase() as any;
      user.subscription.status = "active";
      user.subscription.startDate = new Date();
      // Add 30 days to end date for monthly subscription
      user.subscription.endDate = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );
      user.upgradedAt = new Date();

      // Update limits based on new plan
      user.updateLimitsBasedOnPlan();

      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      plan: order.plan,
      amount: order.amount,
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
