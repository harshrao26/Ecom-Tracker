import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string; // 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'EXPORT_DATA', etc.
  resource: string; // 'User', 'Order', 'Product', 'Session'
  resourceId?: string;
  details: object; // What changed
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

// Index for efficient querying
AuditLogSchema.index({ timestamp: -1, action: 1, resource: 1 });
AuditLogSchema.index({ adminId: 1, timestamp: -1 });

// TTL index - delete logs older than 90 days
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
