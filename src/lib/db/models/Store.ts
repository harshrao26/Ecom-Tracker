import mongoose, { Schema, model, models, Document } from "mongoose";
import crypto from "crypto";

export interface IStore extends Document {
  _id: string;
  userId: string;
  name: string;
  platform: "shopify" | "woocommerce" | "amazon" | "flipkart" | "meta";
  platformStoreId: string;

  // Encrypted credentials
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    apiKey?: string;
    apiSecret?: string;
    shopUrl?: string;
    encryptedData?: string; // All sensitive data encrypted as JSON
  };

  // Sync status
  syncStatus: {
    lastSync?: Date;
    nextSync?: Date;
    status: "active" | "error" | "pending" | "syncing";
    errorMessage?: string;
    lastSyncedOrderCount?: number;
  };

  // Store metadata
  currency: string;
  timezone: string;
  country: string;

  // Settings
  settings: {
    autoSync: boolean;
    syncInterval: number; // in minutes
    notifyOnError: boolean;
  };

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    platform: {
      type: String,
      enum: ["shopify", "woocommerce", "amazon", "flipkart", "meta"],
      required: [true, "Platform is required"],
    },
    platformStoreId: {
      type: String,
      required: true,
    },
    credentials: {
      accessToken: String,
      refreshToken: String,
      apiKey: String,
      apiSecret: String,
      shopUrl: String,
      encryptedData: String,
    },
    syncStatus: {
      lastSync: Date,
      nextSync: Date,
      status: {
        type: String,
        enum: ["active", "error", "pending", "syncing"],
        default: "pending",
      },
      errorMessage: String,
      lastSyncedOrderCount: {
        type: Number,
        default: 0,
      },
    },
    currency: {
      type: String,
      default: "INR",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    country: {
      type: String,
      default: "IN",
    },
    settings: {
      autoSync: {
        type: Boolean,
        default: true,
      },
      syncInterval: {
        type: Number,
        default: 60, // 60 minutes
      },
      notifyOnError: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
StoreSchema.index({ userId: 1, platform: 1 });
StoreSchema.index({ "syncStatus.status": 1 });
StoreSchema.index({ "syncStatus.nextSync": 1 });
StoreSchema.index({ platformStoreId: 1, platform: 1 });

// Encryption helper methods
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY not found in environment variables");
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
    iv,
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY not found in environment variables");
  }

  const parts = text.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
    iv,
  );

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Method to save encrypted credentials
StoreSchema.methods.saveEncryptedCredentials = function (credentials: any) {
  const credentialsString = JSON.stringify(credentials);
  this.credentials.encryptedData = encrypt(credentialsString);
  return this;
};

// Method to get decrypted credentials
StoreSchema.methods.getDecryptedCredentials = function () {
  if (!this.credentials.encryptedData) {
    return null;
  }

  const decryptedString = decrypt(this.credentials.encryptedData);
  return JSON.parse(decryptedString);
};

// Method to schedule next sync
StoreSchema.methods.scheduleNextSync = function () {
  const now = new Date();
  const nextSync = new Date(now.getTime() + this.settings.syncInterval * 60000);
  this.syncStatus.nextSync = nextSync;
  return this;
};

const Store = models.Store || model<IStore>("Store", StoreSchema);

export default Store;
export { encrypt, decrypt };
