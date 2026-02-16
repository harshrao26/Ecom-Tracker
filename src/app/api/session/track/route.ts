import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Session from "@/lib/db/models/Session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      userEmail,
      userName,
      ipAddress,
      location,
      userAgent,
      referrer,
    } = body;

    // Create new session
    const session = await Session.create({
      userId,
      userEmail,
      userName,
      ipAddress: ipAddress || "Unknown",
      location: location || {},
      userAgent: userAgent || "Unknown",
      device: body.device || "unknown",
      referrer: referrer || "direct",
      lastActivity: new Date(),
      loginAt: new Date(),
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      sessionId: session._id.toString(),
    });
  } catch (error: any) {
    console.error("Session tracking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Update session activity
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID required" },
        { status: 400 },
      );
    }

    await Session.findByIdAndUpdate(
      sessionId,
      { lastActivity: new Date() },
      { new: true },
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Session update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
