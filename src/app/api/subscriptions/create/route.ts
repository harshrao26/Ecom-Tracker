import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import RazorpayClient from "@/lib/payment/razorpay-client";
import User from "@/lib/db/models/User";
import Subscription from "@/lib/db/models/Subscription";
import { getSession } from "@/lib/auth";

/**
 * POST /api/subscriptions/create
 * Create a new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    await connectDB();

    const body = await request.json();
    const { plan } = body;

    if (!plan) {
      return NextResponse.json({ error: "plan is required" }, { status: 400 });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Plan pricing (in ₹)
    const planPricing: Record<
      string,
      { amount: number; razorpayPlanId: string }
    > = {
      starter: {
        amount: 999,
        razorpayPlanId: process.env.RAZORPAY_PLAN_STARTER || "",
      },
      growth: {
        amount: 2999,
        razorpayPlanId: process.env.RAZORPAY_PLAN_GROWTH || "",
      },
      enterprise: {
        amount: 9999,
        razorpayPlanId: process.env.RAZORPAY_PLAN_ENTERPRISE || "",
      },
    };

    if (plan === "free") {
      return NextResponse.json(
        { error: "Free plan does not require subscription" },
        { status: 400 },
      );
    }

    const planDetails = planPricing[plan];
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const razorpayClient = new RazorpayClient();

    // Create Razorpay customer if not exists
    let razorpayCustomerId = user.razorpayCustomerId;
    if (!razorpayCustomerId) {
      const customer = await razorpayClient.createCustomer({
        name: user.name,
        email: user.email,
        contact: user.phone || "0000000000",
      });
      razorpayCustomerId = customer.id;

      // Save customer ID to user
      user.razorpayCustomerId = razorpayCustomerId;
      await user.save();
    }

    // Create Razorpay subscription
    const subscription = (await razorpayClient.createSubscription({
      planId: planDetails.razorpayPlanId,
      customerId: razorpayCustomerId,
      totalCount: 12, // 12 months
      quantity: 1,
    })) as any; // Type assertion for Razorpay response

    // Calculate dates
    const startDate = new Date();
    const nextBillingDate = new Date(startDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Save subscription to database
    const newSubscription = new Subscription({
      userId: user._id,
      plan,
      razorpaySubscriptionId: subscription.id,
      razorpayCustomerId,
      razorpayPlanId: planDetails.razorpayPlanId,
      status: "active",
      billingCycle: "monthly",
      amount: planDetails.amount,
      currency: "INR",
      startDate,
      nextBillingDate,
      autoRenew: true,
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url,
      message: "Subscription created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating subscription:", error);

    return NextResponse.json(
      {
        error: "Failed to create subscription",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/subscriptions/create
 * Get user's subscription details
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    await connectDB();

    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
        message: "No active subscription",
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        status: subscription.status,
        amount: subscription.amount,
        billingCycle: subscription.billingCycle,
        nextBillingDate: subscription.nextBillingDate,
        autoRenew: subscription.autoRenew,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching subscription:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
