import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IRevenueEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: "new" | "expansion" | "contraction" | "churn";
  eventDate: Date;
  amount: number;
  previousPlan?: string;
  newPlan?: string;
  reason?: string;
  createdAt: Date;
}

const RevenueEventSchema = new Schema<IRevenueEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventType: {
      type: String,
      enum: ["new", "expansion", "contraction", "churn"],
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    previousPlan: {
      type: String,
      enum: ["free", "starter", "growth", "enterprise"],
    },
    newPlan: {
      type: String,
      enum: ["free", "starter", "growth", "enterprise"],
    },
    reason: String,
  },
  {
    timestamps: true,
  },
);

// Indexes
RevenueEventSchema.index({ userId: 1, eventDate: -1 });
RevenueEventSchema.index({ eventType: 1, eventDate: -1 });
RevenueEventSchema.index({ eventDate: -1 });

const RevenueEvent =
  models.RevenueEvent ||
  model<IRevenueEvent>("RevenueEvent", RevenueEventSchema);

export default RevenueEvent;
