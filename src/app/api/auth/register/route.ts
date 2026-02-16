import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";
import { sendEmail } from "@/lib/email/nodemailer";
import { verificationEmailTemplate } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, mobile, password, plan = "free" } = body;

    // Validation
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    const cleanMobile = mobile.replace(/\s/g, "");

    if (!mobileRegex.test(cleanMobile)) {
      return NextResponse.json(
        { success: false, error: "Invalid mobile number format" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user (User model handle hashing via pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile: cleanMobile,
      password: password, // Pass plain password, model will hash it exactly once
      role: "user",
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      subscription: {
        plan: plan === "free" ? "free" : "starter", // Default plan based on selection
        status: "trialing",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
      },
    });

    // Send verification email
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationLink = `${APP_URL}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - Online Planet",
      html: verificationEmailTemplate(user.name, verificationLink),
    });

    // Create a subscription document (if needed)
    // await Subscription.create({ ... });

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create account",
      },
      { status: 500 },
    );
  }
}
