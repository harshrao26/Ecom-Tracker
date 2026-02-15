import mongoose, { Schema, Document } from "mongoose";

export interface IInsight extends Document {
  userId: string;
  storeId: string;
  type: "forecast" | "profit" | "churn" | "marketing" | "regional" | "growth" | "behavior" | "product" | "geo" | "zeroClick" | "logistics" | "content" | "sentiment" | "benchmark" | "all";
  language: "en" | "hi";
  content: any;
  legacyFormat?: any;
  metadata: {
    generationTime: number;
    model: string;
    timestamp: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    storeId: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["forecast", "profit", "churn", "marketing", "regional", "growth", "behavior", "product", "geo", "zeroClick", "logistics", "content", "sentiment", "benchmark", "all"],
    },
    language: {
      type: String,
      required: true,
      enum: ["en", "hi"],
      default: "en",
    },
    content: { type: Schema.Types.Mixed, required: true },
    legacyFormat: { type: Schema.Types.Mixed },
    metadata: {
      generationTime: { type: Number },
      model: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for quick lookups
InsightSchema.index(
  { userId: 1, storeId: 1, type: 1, language: 1 },
  { unique: true },
);

export default mongoose.models.Insight ||
  mongoose.model<IInsight>("Insight", InsightSchema);
