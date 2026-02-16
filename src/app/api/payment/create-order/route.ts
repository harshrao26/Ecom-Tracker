import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/connection";
import Order from "@/lib/db/models/Order";
import User from "@/lib/db/models/User";
import { PRICING_PLANS, PlanId } from "@/lib/pricing.config";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { planId } = await req.json();
    if (!planId || !PRICING_PLANS[planId as PlanId]) {
      return NextResponse.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    const plan = PRICING_PLANS[planId as PlanId];

    // Free plan doesn't need a Razorpay order
    if (plan.amount_in_paise === 0) {
      return NextResponse.json(
        { success: false, error: "Free plan does not require payment" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Create Razorpay Order
    const options = {
      amount: plan.amount_in_paise,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${session.userId.substring(0, 5)}`,
      notes: {
        userId: session.userId,
        planId: planId,
        userEmail: user.email,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save pending order in our database for tracking/abandonment analysis
    await Order.create({
      userId: user._id,
      customerName: user.name,
      customerEmail: user.email,
      amount: plan.price,
      currency: "INR",
      plan: planId,
      status: "pending",
      razorpay_order_id: razorpayOrder.id,
      metadata: {
        planId: planId,
        razorpay_receipt: razorpayOrder.receipt,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
