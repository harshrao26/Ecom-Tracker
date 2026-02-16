#!/usr/bin/env node
/**
 * SMTP Connection Test Script
 * Tests SMTP config from .env.local without nodemailer dependency
 * Run: node test-smtp-simple.js
 */

const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");

// Parse .env.local manually
function loadEnv() {
  const envPath = path.join(__dirname, ".env.local");
  const envContent = fs.readFileSync(envPath, "utf8");
  const env = {};

  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes
      value = value.replace(/^["']|["']$/g, "");
      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();

console.log("🔍 SMTP Connection Test\n");
console.log("📧 Configuration:");
console.log(`   Host: ${env.SMTP_HOST}`);
console.log(`   Port: ${env.SMTP_PORT}`);
console.log(`   Secure: ${env.SMTP_SECURE}`);
console.log(`   User: ${env.SMTP_USER}`);
console.log(`   From: ${env.SMTP_FROM_EMAIL}\n`);

// Test SMTP connection
function testSMTPConnection() {
  return new Promise((resolve, reject) => {
    const port = parseInt(env.SMTP_PORT);
    const isSecure = env.SMTP_SECURE === "true";

    console.log(`🔌 Testing connection to ${env.SMTP_HOST}:${port}...`);

    const options = {
      host: env.SMTP_HOST,
      port: port,
      timeout: 10000,
    };

    if (isSecure && port === 465) {
      // SSL/TLS connection
      const socket = tls.connect(options, () => {
        console.log("✅ SSL/TLS connection established");
        socket.end();
        resolve(true);
      });

      socket.on("error", (err) => {
        reject(err);
      });

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("Connection timeout"));
      });
    } else {
      // Plain TCP connection (for STARTTLS)
      const socket = net.connect(options, () => {
        console.log("✅ TCP connection established");
        socket.end();
        resolve(true);
      });

      socket.on("error", (err) => {
        reject(err);
      });

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("Connection timeout"));
      });
    }
  });
}

// Run test
(async () => {
  try {
    await testSMTPConnection();

    console.log("\n🎉 SMTP SERVER IS REACHABLE!\n");
    console.log("✅ Connection successful");
    console.log("📝 Next step: Try signup to test email sending\n");
    console.log("If signup sends email successfully, SMTP is fully working!");
    console.log(
      'If you get "554 5.7.1 Disabled" error, enable SMTP in hPanel:\n',
    );
    console.log("   1. Login to hpanel.hostinger.com");
    console.log("   2. Emails > Email Accounts");
    console.log(`   3. Manage ${env.SMTP_USER}`);
    console.log('   4. Enable "SMTP Access"\n');
  } catch (error) {
    console.error("\n❌ SMTP TEST FAILED!\n");
    console.error(`Error: ${error.message}\n`);

    if (error.code === "ECONNREFUSED") {
      console.error("🚫 Connection refused. Possible causes:");
      console.error(`   - SMTP server ${env.SMTP_HOST} is not responding`);
      console.error(`   - Port ${env.SMTP_PORT} is blocked by firewall/ISP`);
      console.error("   - Wrong host/port in .env.local\n");
    } else if (error.code === "ETIMEDOUT" || error.code === "TIMEOUT") {
      console.error("⏱️  Connection timeout. Possible causes:");
      console.error("   - Firewall blocking SMTP port");
      console.error("   - ISP blocking SMTP traffic");
      console.error("   - DNS resolution issues\n");
    } else if (error.code === "ENOTFOUND") {
      console.error("🔍 Host not found:");
      console.error(`   - Check SMTP_HOST: ${env.SMTP_HOST}`);
      console.error("   - Verify DNS resolution\n");
    }

    process.exit(1);
  }
})();
