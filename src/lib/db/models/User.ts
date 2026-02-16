import mongoose, { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile?: string;
  phone?: string;
  password: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  language: "en" | "hi" | "hinglish";
  role: "user" | "admin" | "super-admin";
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
  cohortMonth: string; // Format: "2026-01"
  upgradedAt?: Date;
  downgradedAt?: Date;
  churnedAt?: Date;
  lastLoginAt?: Date;
  healthScore?: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
    mobile: {
      type: String,
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    language: {
      type: String,
      enum: ["en", "hi", "hinglish"],
      default: "en",
    },
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
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
    cohortMonth: {
      type: String,
      default: function () {
        return new Date().toISOString().substring(0, 7);
      },
    },
    upgradedAt: Date,
    downgradedAt: Date,
    churnedAt: Date,
    lastLoginAt: Date,
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
  },
  {
    timestamps: true,
  },
);

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  // If password isn't modified, we don't need to do anything
  if (!this.isModified("password")) {
    return next();
  }

  // CRITICAL: Check if it's already a bcrypt hash to prevent double hashing
  // Format: $2a$cost$salt+hash
  const isBcryptHash = /^\$2[ayb]\$\d{2}\$.*/.test(this.password);
  if (isBcryptHash) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

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
      historicalDataMonths: 0, // Today only
      aiInsights: false,
    },
    starter: {
      maxStores: 2,
      maxOrders: 1000,
      historicalDataMonths: 1, // 30 days
      aiInsights: false,
    },
    growth: {
      maxStores: 5,
      maxOrders: 10000,
      historicalDataMonths: 3, // 90 days
      aiInsights: true,
    },
    enterprise: {
      maxStores: -1, // Unlimited
      maxOrders: -1,
      historicalDataMonths: -1,
      aiInsights: true,
    },
  };

  this.limits = (planLimits as any)[this.subscription.plan];
  return this;
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
