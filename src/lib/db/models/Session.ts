import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  ipAddress: string;
  location: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  userAgent: string;
  device: string; // 'desktop', 'mobile', 'tablet', 'unknown'
  referrer?: string; // Traffic source
  currentPage?: string; // Current page/URL being viewed
  lastActivity: Date;
  loginAt: Date;
  logoutAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    userAgent: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
      index: true,
    },
    referrer: {
      type: String,
      default: "direct",
    },
    currentPage: {
      type: String,
      default: "/",
    },
    lastActivity: {
      type: Date,
      default: Date.now,
      index: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
    },
    logoutAt: Date,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// TTL index to automatically delete inactive sessions after 30 days
SessionSchema.index(
  { lastActivity: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 },
);

// Method to mark session as inactive
SessionSchema.methods.endSession = function () {
  this.isActive = false;
  this.logoutAt = new Date();
  return this.save();
};

// Static method to get active sessions (active in last 5 minutes)
SessionSchema.statics.getActiveSessions = function () {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.find({
    isActive: true,
    lastActivity: { $gte: fiveMinutesAgo },
  }).sort({ lastActivity: -1 });
};

// Static method to update activity timestamp
SessionSchema.statics.updateActivity = async function (sessionId: string) {
  return this.findByIdAndUpdate(
    sessionId,
    { lastActivity: new Date() },
    { new: true },
  );
};

export default mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);
