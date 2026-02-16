const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

async function testEmail() {
  console.log("📧 Testing Email Sending with Gmail SMTP...\n");

  console.log("🔍 Configuration:");
  console.log("   Host:", process.env.SMTP_HOST);
  console.log("   Port:", process.env.SMTP_PORT);
  console.log("   User:", process.env.SMTP_USER);
  console.log("   From:", process.env.SMTP_FROM_EMAIL);
  console.log("");

  // Check if App Password is set
  if (
    !process.env.SMTP_PASS ||
    process.env.SMTP_PASS.includes("your-16-char")
  ) {
    console.error("❌ SMTP_PASS not configured!\n");
    console.error("🔑 Please set Gmail App Password in .env.local:\n");
    console.error("   1. Visit: https://myaccount.google.com/apppasswords");
    console.error("   2. Generate App Password");
    console.error("   3. Update SMTP_PASS in .env.local\n");
    process.exit(1);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("🔌 Verifying connection...");
    await transporter.verify();
    console.log("✅ Connection verified!\n");

    console.log("📤 Sending test email...");
    const fromName = process.env.SMTP_FROM_NAME || "Online Planet";
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: process.env.SMTP_USER,
      subject: "Email Configuration Verified - Online Planet",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1f2937;">
          <div style="padding-bottom: 20px; border-bottom: 2px solid #2563eb; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 1px;">ONLINE PLANET</h1>
          </div>
          <div>
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">SMTP Service Verified</h2>
            <p>Your email configuration has been successfully verified. The following services are now ready:</p>
            <ul style="padding-left: 20px; margin: 20px 0;">
              <li style="margin-bottom: 8px;">Email Verification</li>
              <li style="margin-bottom: 8px;">Password Recovery</li>
              <li style="margin-bottom: 8px;">Automated Reports</li>
            </ul>
            <div style="background-color: #f8fafc; border: 1px solid #e5e7eb; padding: 20px; border-radius: 4px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 14px; text-transform: uppercase; color: #6b7280;">Test Details</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 13px;">Host: ${process.env.SMTP_HOST}</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 13px;">Port: ${process.env.SMTP_PORT}</p>
              <p style="margin: 5px 0; font-family: monospace; font-size: 13px;">User: ${process.env.SMTP_USER}</p>
            </div>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Online Planet. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("");
    console.log("🎉 ALL TESTS PASSED!");
    console.log("📬 Check inbox:", process.env.SMTP_USER);
    console.log("");
    console.log("✅ Email verification & password reset are ready!");
    console.log("🚀 Try signup now: http://localhost:3000/signup\n");
  } catch (error) {
    console.error("\n❌ EMAIL TEST FAILED!\n");
    console.error("Error:", error.message);

    if (error.code === "EAUTH") {
      console.error("\n🔑 Gmail Authentication Failed!\n");
      console.error("Possible issues:");
      console.error("   1. Wrong App Password");
      console.error("   2. 2-Step Verification not enabled");
      console.error("   3. App Password not generated\n");
      console.error("Fix:");
      console.error("   • Visit: https://myaccount.google.com/apppasswords");
      console.error("   • Enable 2-Step Verification first");
      console.error("   • Generate new App Password");
      console.error("   • Update SMTP_PASS in .env.local (remove spaces)\n");
    } else {
      console.error("\nDetails:", error);
    }

    process.exit(1);
  }
}

testEmail();
