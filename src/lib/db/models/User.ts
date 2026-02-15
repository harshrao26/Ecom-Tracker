import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  language: "en" | "hi" | "hinglish";
  subscription: {
    plan: "free" | "starter" | "growth" | "enterprise";
    status: "active" | "cancelled" | "expired" | "trialing";
    startDate: Date;
    endDate?: Date;
    razorpaySubscriptionId?: string;
    razorpayCustomerId?: string;
  };
  limits: {
    maxStores: number;
    maxOrders: number;
    historicalDataMonths: number;
    aiInsights: boolean;
  };
  connectedStores: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    language: {
      type: String,
      enum: ["en", "hi", "hinglish"],
      default: "en",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "starter", "growth", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "cancelled", "expired", "trialing"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: Date,
      razorpaySubscriptionId: String,
      razorpayCustomerId: String,
    },
    limits: {
      maxStores: {
        type: Number,
        default: 1, // Free tier: 1 store
      },
      maxOrders: {
        type: Number,
        default: 100, // Free tier: 100 orders/month
      },
      historicalDataMonths: {
        type: Number,
        default: 1, // Free tier: 1 month historical data
      },
      aiInsights: {
        type: Boolean,
        default: false, // Free tier: no AI insights
      },
    },
    connectedStores: [
      {
        type: Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ "subscription.plan": 1 });
UserSchema.index({ "subscription.status": 1 });

// Method to update subscription limits based on plan
UserSchema.methods.updateLimitsBasedOnPlan = function () {
  const planLimits = {
    free: {
      maxStores: 1,
      maxOrders: 100,
      historicalDataMonths: 1,
      aiInsights: false,
    },
    starter: {
      maxStores: 2,
      maxOrders: 500,
      historicalDataMonths: 6,
      aiInsights: false,
    },
    growth: {
      maxStores: 5,
      maxOrders: -1, // Unlimited
      historicalDataMonths: -1, // Unlimited
      aiInsights: true,
    },
    enterprise: {
      maxStores: -1, // Unlimited
      maxOrders: -1,
      historicalDataMonths: -1,
      aiInsights: true,
    },
  };

  this.limits = planLimits[this.subscription.plan];
  return this;
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
