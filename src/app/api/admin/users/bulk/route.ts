import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import { logAuditAction, AuditActions } from "@/lib/utils/auditLog";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, userIds } = body;

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    let result;
    const adminId = "admin-id-placeholder"; // TODO: Get from session
    const adminEmail = "admin@example.com";

    switch (action) {
      case "delete":
        result = await User.deleteMany({ _id: { $in: userIds } });
        await logAuditAction(
          {
            adminId,
            adminEmail,
            action: AuditActions.BULK_DELETE_USERS,
            resource: "User",
            details: { count: result.deletedCount, userIds },
          },
          request,
        );
        break;

      case "suspend":
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: false } },
        );
        await logAuditAction(
          {
            adminId,
            adminEmail,
            action: "BULK_SUSPEND_USERS",
            resource: "User",
            details: { count: result.modifiedCount, userIds },
          },
          request,
        );
        break;

      case "activate":
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: true } },
        );
        await logAuditAction(
          {
            adminId,
            adminEmail,
            action: "BULK_ACTIVATE_USERS",
            resource: "User",
            details: { count: result.modifiedCount, userIds },
          },
          request,
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        ...result,
      },
    });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform bulk action" },
      { status: 500 },
    );
  }
}
