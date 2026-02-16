import * as dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function debugAuth() {
  try {
    const { default: connectDB } = await import("../src/lib/db/connection");
    const { default: User } = await import("../src/lib/db/models/User");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const email = "harshurao058@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    console.log(`👤 User: ${user.email}`);
    console.log(`🔐 Password in DB: ${user.password}`);

    const isHashed = user.password.startsWith("$2");
    console.log(`🧐 Is Hashed (starts with $2): ${isHashed}`);

    if (!isHashed) {
      console.log("⚠️ Password is PLAIN TEXT. Hashing it now...");
      user.password = user.password; // Trigger pre-save hook
      await user.save();
      console.log("✅ Password hashed and saved.");
    } else {
      const testPass = "Harsh@7233";
      const isMatch = await bcrypt.compare(testPass, user.password);
      console.log(
        `🧪 Test comparison with "${testPass}": ${isMatch ? "SUCCESS ✅" : "FAILED ❌"}`,
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  }
}

debugAuth();
