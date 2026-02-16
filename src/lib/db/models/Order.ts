import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  plan: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: string;
  transactionId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
    plan: {
      type: String,
      required: true,
      enum: ["free", "starter", "growth", "enterprise"],
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    razorpay_order_id: {
      type: String,
      index: true,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ plan: 1, status: 1 });

// Virtual for revenue (only count completed orders)
OrderSchema.virtual("isRevenue").get(function () {
  return this.status === "completed";
});

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
