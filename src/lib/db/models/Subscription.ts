/**
 * Subscription Model
 * Tracks user subscriptions and payments
 */

import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["free", "starter", "growth", "enterprise"],
      required: true,
    },

    // Razorpay details
    razorpaySubscriptionId: String,
    razorpayCustomerId: String,
    razorpayPlanId: String,

    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: Date,

    nextBillingDate: Date,

    autoRenew: {
      type: Boolean,
      default: true,
    },

    paymentHistory: [
      {
        razorpayPaymentId: String,
        amount: Number,
        status: String,
        paidAt: Date,
        invoiceUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });
subscriptionSchema.index({ status: 1 });

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
