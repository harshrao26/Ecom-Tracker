import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import RazorpayClient from "@/lib/payment/razorpay-client";
import Subscription from "@/lib/db/models/Subscription";
import User from "@/lib/db/models/User";

/**
 * POST /api/subscriptions/webhook
 * Razorpay webhook handler for subscription events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Parse event
    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    await connectDB();

    // Handle different event types
    switch (eventType) {
      case "subscription.activated":
        await handleSubscriptionActivated(payload.subscription.entity);
        break;

      case "subscription.charged":
        await handleSubscriptionCharged(
          payload.payment.entity,
          payload.subscription.entity,
        );
        break;

      case "subscription.cancelled":
        await handleSubscriptionCancelled(payload.subscription.entity);
        break;

      case "subscription.completed":
        await handleSubscriptionCompleted(payload.subscription.entity);
        break;

      case "subscription.paused":
        await handleSubscriptionPaused(payload.subscription.entity);
        break;

      case "subscription.resumed":
        await handleSubscriptionResumed(payload.subscription.entity);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

async function handleSubscriptionActivated(subscription: any) {
  console.log("✅ Subscription activated:", subscription.id);

  await Subscription.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    { status: "active" },
  );
}

async function handleSubscriptionCharged(payment: any, subscription: any) {
  console.log("💰 Subscription charged:", subscription.id, payment.id);

  const sub = await Subscription.findOne({
    razorpaySubscriptionId: subscription.id,
  });

  if (sub) {
    // Add payment to history
    sub.paymentHistory.push({
      razorpayPaymentId: payment.id,
      amount: payment.amount / 100, // Convert from paise
      status: payment.status,
      paidAt: new Date(payment.created_at * 1000),
      invoiceUrl: payment.invoice_url,
    });

    // Update next billing date
    const nextBillingDate = new Date(sub.nextBillingDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    sub.nextBillingDate = nextBillingDate;

    await sub.save();

    // Update user plan if needed
    await User.findByIdAndUpdate(sub.userId, {
      plan: sub.plan,
    });
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  console.log("🚫 Subscription cancelled:", subscription.id);

  await Subscription.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    { status: "cancelled", autoRenew: false },
  );

  // Optionally downgrade user to free plan
  const sub = await Subscription.findOne({
    razorpaySubscriptionId: subscription.id,
  });

  if (sub) {
    await User.findByIdAndUpdate(sub.userId, {
      plan: "free",
    });
  }
}

async function handleSubscriptionCompleted(subscription: any) {
  console.log("✅ Subscription completed:", subscription.id);

  await Subscription.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    { status: "expired" },
  );
}

async function handleSubscriptionPaused(subscription: any) {
  console.log("⏸ Subscription paused:", subscription.id);

  await Subscription.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    { status: "paused" },
  );
}

async function handleSubscriptionResumed(subscription: any) {
  console.log("▶️ Subscription resumed:", subscription.id);

  await Subscription.findOneAndUpdate(
    { razorpaySubscriptionId: subscription.id },
    { status: "active" },
  );
}
