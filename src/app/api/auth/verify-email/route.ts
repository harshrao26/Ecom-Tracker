import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import { sendEmail } from "@/lib/email/nodemailer";
import { welcomeEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 },
      );
    }

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 400 },
      );
    }

    // Mark user as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: "Welcome to Online Planet! 🎉",
      html: welcomeEmailTemplate(user.name),
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify email" },
      { status: 500 },
    );
  }
}
