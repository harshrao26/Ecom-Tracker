import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Role-based logic could be added here if needed

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Track session (async, don't wait)
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const referrer = request.headers.get("referer") || "direct";

    //  Detect device type
    const detectDevice = (ua: string): string => {
      const uaLower = ua.toLowerCase();
      if (
        uaLower.includes("ipad") ||
        uaLower.includes("tablet") ||
        (uaLower.includes("android") && !uaLower.includes("mobile"))
      )
        return "tablet";
      if (
        uaLower.includes("mobile") ||
        uaLower.includes("iphone") ||
        uaLower.includes("android")
      )
        return "mobile";
      if (
        uaLower.includes("windows") ||
        uaLower.includes("mac") ||
        uaLower.includes("linux")
      )
        return "desktop";
      return "unknown";
    };

    // In production, you would fetch location from IP using a service like ip-api.com
    fetch(`${request.nextUrl.origin}/api/session/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name,
        ipAddress,
        userAgent,
        device: detectDevice(userAgent),
        referrer,
        location: {
          country: "India", // Default, would be fetched from IP API in production
        },
      }),
    }).catch((e) => console.error("Session tracking failed:", e));

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
