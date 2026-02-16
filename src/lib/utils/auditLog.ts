import { NextRequest } from "next/server";
import AuditLog from "@/lib/db/models/AuditLog";
import connectDB from "@/lib/db/connection";

export interface AuditLogData {
  adminId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: object;
}

/**
 * Log an audit action to the database
 */
export async function logAuditAction(
  data: AuditLogData,
  req: NextRequest,
): Promise<void> {
  try {
    await connectDB();

    // Extract IP and User Agent from request
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "Unknown";

    const userAgent = req.headers.get("user-agent") || "Unknown";

    await AuditLog.create({
      adminId: data.adminId,
      adminEmail: data.adminEmail,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details || {},
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break main functionality
    console.error("Failed to log audit action:", error);
  }
}

/**
 * Common audit action types
 */
export const AuditActions = {
  // User actions
  CREATE_USER: "CREATE_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  SUSPEND_USER: "SUSPEND_USER",
  ACTIVATE_USER: "ACTIVATE_USER",
  BULK_DELETE_USERS: "BULK_DELETE_USERS",

  // Data export
  EXPORT_USERS_CSV: "EXPORT_USERS_CSV",
  EXPORT_ANALYTICS_CSV: "EXPORT_ANALYTICS_CSV",
  EXPORT_SESSIONS_CSV: "EXPORT_SESSIONS_CSV",
  GENERATE_PDF_REPORT: "GENERATE_PDF_REPORT",

  // Settings
  UPDATE_SETTINGS: "UPDATE_SETTINGS",

  // Auth
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",
} as const;
