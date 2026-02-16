// SMTP Test Script (ES Module)
// Run: node test-smtp.mjs

import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("🔍 Testing SMTP Configuration...\n");

// Display current config
console.log("📧 SMTP Config:");
console.log(`   Host: ${process.env.SMTP_HOST}`);
console.log(`   Port: ${process.env.SMTP_PORT}`);
console.log(`   Secure: ${process.env.SMTP_SECURE}`);
console.log(`   User: ${process.env.SMTP_USER}`);
console.log(`   From Name: ${process.env.SMTP_FROM_NAME}`);
console.log(`   From Email: ${process.env.SMTP_FROM_EMAIL}\n`);

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function testSMTP() {
  try {
    // Test 1: Verify connection
    console.log("🔌 Test 1: Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    // Test 2: Send test email
    console.log("📤 Test 2: Sending test email...");

    const fromName = process.env.SMTP_FROM_NAME || "Online Planet";
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    const testEmail = {
      from: `"${fromName}" <${fromEmail}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: "✅ SMTP Test Email - Online Planet",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🎉 SMTP Test Successful!</h2>
          <p>Your SMTP configuration is working perfectly!</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Configuration Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Host:</strong> ${process.env.SMTP_HOST}</li>
              <li><strong>Port:</strong> ${process.env.SMTP_PORT}</li>
              <li><strong>Secure:</strong> ${process.env.SMTP_SECURE}</li>
              <li><strong>From:</strong> ${fromEmail}</li>
            </ul>
          </div>
          <p style="color: #10B981; font-weight: bold;">✅ Email verification & password reset will work!</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #6B7280; font-size: 12px;">Test email sent at ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `SMTP Test Successful! Your configuration is working. Email verification and password reset features are ready to use.`,
    };

    const info = await transporter.sendMail(testEmail);
    console.log("✅ Test email sent successfully!");
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);

    console.log("🎉 ALL TESTS PASSED!");
    console.log("📧 Check your inbox:", process.env.SMTP_USER);
    console.log("✅ Email verification & password reset are ready to use!\n");
  } catch (error) {
    console.error("\n❌ SMTP TEST FAILED!\n");
    console.error("Error:", error.message);

    if (error.code === "EAUTH") {
      console.error("\n🔑 Authentication failed. Check:");
      console.error("   - SMTP_USER is correct");
      console.error("   - SMTP_PASS is correct");
      console.error("   - Password has correct quotes in .env.local\n");
    } else if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      console.error("\n🔌 Connection failed. Check:");
      console.error("   - SMTP_HOST is correct");
      console.error("   - SMTP_PORT is correct");
      console.error(
        "   - Firewall/ISP not blocking port",
        process.env.SMTP_PORT,
      );
      console.error("   - SMTP is enabled in hPanel\n");
    } else if (error.responseCode === 554) {
      console.error("\n🚫 SMTP disabled in hPanel. You need to:");
      console.error("   1. Login to hpanel.hostinger.com");
      console.error("   2. Go to Emails > Email Accounts");
      console.error("   3. Click Manage on", process.env.SMTP_USER);
      console.error('   4. Enable "SMTP Access" or "External Email Clients"');
      console.error("   5. Save changes\n");
    }

    process.exit(1);
  }
}

// Run the test
testSMTP();
