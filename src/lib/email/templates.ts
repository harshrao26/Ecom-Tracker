const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = "Online Planet";

// Shared styles and components
const primaryColor = "#2563eb"; // Professional Blue
const secondaryColor = "#1e40af";
const textColor = "#1f2937";
const mutedColor = "#6b7280";
const bgColor = "#ffffff";
const borderColor = "#e5e7eb";

const emailWrapper = `
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: ${bgColor};
  color: ${textColor};
  line-height: 1.5;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const headerStyle = `
  padding-bottom: 30px;
  border-bottom: 2px solid ${primaryColor};
  margin-bottom: 30px;
`;

const buttonStyle = `
  display: inline-block;
  background-color: ${primaryColor};
  color: #ffffff;
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  margin: 20px 0;
`;

const footerStyle = `
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${borderColor};
  font-size: 12px;
  color: ${mutedColor};
  text-align: center;
`;

// Email verification template
export const verificationEmailTemplate = (
  name: string,
  verificationLink: string,
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="${emailWrapper}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
        ${APP_NAME}
      </h1>
    </div>
    
    <div>
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Email Verification</h2>
      <p>Hello ${name},</p>
      <p>Thank you for joining ${APP_NAME}. To complete your registration and secure your account, please verify your email address.</p>
      
      <div style="text-align: center; padding: 10px 0;">
        <a href="${verificationLink}" style="${buttonStyle}">Verify Email Address</a>
      </div>
      
      <p style="font-size: 14px; color: ${mutedColor};">
        Note: This link will expire in 24 hours. If you did not sign up for an account, you can safely ignore this email.
      </p>
      
      <div style="margin-top: 24px; font-size: 13px; color: ${mutedColor};">
        <p style="margin-bottom: 4px;">If the button above doesn't work, copy and paste the following link:</p>
        <a href="${verificationLink}" style="color: ${primaryColor}; text-decoration: none; word-break: break-all;">${verificationLink}</a>
      </div>
    </div>
    
    <div style="${footerStyle}">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Password reset template
export const passwordResetEmailTemplate = (name: string, resetLink: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="${emailWrapper}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
        ${APP_NAME}
      </h1>
    </div>
    
    <div>
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset the password for your ${APP_NAME} account. To proceed, please use the button below:</p>
      
      <div style="text-align: center; padding: 10px 0;">
        <a href="${resetLink}" style="${buttonStyle}">Reset Password</a>
      </div>
      
      <p style="font-size: 14px; color: ${mutedColor};">
        This link is valid for 1 hour. If you did not request this reset, your password will remain unchanged and you can safely ignore this email.
      </p>
      
      <div style="margin-top: 24px; font-size: 13px; color: ${mutedColor};">
        <p style="margin-bottom: 4px;">If you're having trouble with the button, copy and paste this link:</p>
        <a href="${resetLink}" style="color: ${primaryColor}; text-decoration: none; word-break: break-all;">${resetLink}</a>
      </div>
    </div>
    
    <div style="${footerStyle}">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Welcome email template (sent after verification)
export const welcomeEmailTemplate = (name: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${APP_NAME}</title>
</head>
<body style="${emailWrapper}">
  <div style="${containerStyle}">
    <div style="${headerStyle}">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 1px;">
        ${APP_NAME}
      </h1>
    </div>
    
    <div>
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Registration Confirmed</h2>
      <p>Hello ${name},</p>
      <p>Your email has been successfully verified. Your account is now fully active, and you have access to all features of ${APP_NAME}.</p>
      
      <div style="margin: 24px 0;">
        <p style="font-weight: 600; margin-bottom: 8px;">Getting Started:</p>
        <ul style="padding-left: 20px; margin: 0; color: ${textColor};">
          <li style="margin-bottom: 8px;">Connect your first e-commerce store</li>
          <li style="margin-bottom: 8px;">Explore your analytics dashboard</li>
          <li style="margin-bottom: 8px;">Set up automated reports</li>
        </ul>
      </div>
      
      <div style="text-align: center; padding: 10px 0;">
        <a href="${APP_URL}/dashboard" style="${buttonStyle}">Go to Dashboard</a>
      </div>
      
      <p>If you have any questions or need assistance, our support team is always here to help.</p>
    </div>
    
    <div style="${footerStyle}">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};
