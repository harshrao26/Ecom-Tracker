import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import { logAuditAction, AuditActions } from "@/lib/utils/auditLog";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, role, isActive } = body;

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Track changes for audit
    const changes: any = {};
    if (name && name !== user.name)
      changes.name = { from: user.name, to: name };
    if (email && email !== user.email)
      changes.email = { from: user.email, to: email };
    if (role && role !== user.role)
      changes.role = { from: user.role, to: role };
    if (isActive !== undefined && isActive !== user.isActive) {
      changes.isActive = { from: user.isActive, to: isActive };
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    // Log audit action
    const action =
      isActive === false
        ? AuditActions.SUSPEND_USER
        : isActive === true && !user.isActive
          ? AuditActions.ACTIVATE_USER
          : AuditActions.UPDATE_USER;

    await logAuditAction(
      {
        adminId: "admin-id-placeholder",
        adminEmail: "admin@example.com",
        action,
        resource: "User",
        resourceId: user._id.toString(),
        details: changes,
      },
      request,
    );

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const userData = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await User.findByIdAndDelete(params.id);

    // Log audit action
    await logAuditAction(
      {
        adminId: "admin-id-placeholder",
        adminEmail: "admin@example.com",
        action: AuditActions.DELETE_USER,
        resource: "User",
        resourceId: params.id,
        details: userData,
      },
      request,
    );

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
