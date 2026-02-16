import * as dotenv from "dotenv";
import path from "path";

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function setupSuperAdmin() {
  try {
    // Dynamically import models after env is loaded
    const { default: connectDB } = await import("../src/lib/db/connection");
    const { default: User } = await import("../src/lib/db/models/User");
    const { default: Store } = await import("../src/lib/db/models/Store");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    const ADMIN_EMAIL = "harshurao058@gmail.com";
    const ADMIN_PASSWORD = "Harsh@7233";

    // 1. Create/Update Super Admin
    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
      console.log(
        `👤 Found existing user ${ADMIN_EMAIL}, promoting to super-admin...`,
      );
      admin.role = "super-admin";
      admin.password = ADMIN_PASSWORD;
      await admin.save();
    } else {
      console.log(`👤 Creating new super-admin: ${ADMIN_EMAIL}`);
      admin = await User.create({
        name: "Harsh Rao",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "super-admin",
        language: "en",
        cohortMonth: new Date().toISOString().substring(0, 7),
        healthScore: 100,
        lastLoginAt: new Date(),
        subscription: {
          plan: "enterprise",
          status: "active",
          startDate: new Date(),
        },
      });
    }
    console.log("✅ Super Admin setup successfully");

    // 2. Seed some dummy subscribers
    const subscriberEmails = [
      "growth_user@example.com",
      "starter_user@example.com",
      "free_user@example.com",
      "expired_user@example.com",
    ];

    for (const email of subscriberEmails) {
      const existing = await User.findOne({ email });
      if (!existing) {
        const type = email.split("_")[0];
        const plan = type === "expired" ? "starter" : (type as any);
        const status = type === "expired" ? "expired" : "active";

        const user = await User.create({
          name: email.split("@")[0].replace("_", " "),
          email,
          password: "password123",
          role: "user",
          cohortMonth: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substring(0, 7),
          healthScore:
            plan === "expired" ? 20 : Math.floor(Math.random() * 40) + 50,
          lastLoginAt:
            plan === "expired"
              ? new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
              : new Date(
                  Date.now() -
                    Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
                ),
          subscription: {
            plan: plan === "expired" ? "starter" : plan,
            status: status,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate:
              status === "expired"
                ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        await Store.create({
          userId: user._id,
          name: `${user.name}'s Shop`,
          platform: "shopify",
          platformStoreId: `shop_${user._id}`,
          isActive: true,
          syncStatus: {
            status: "active",
            lastSync: new Date(),
            nextSync: new Date(Date.now() + 1 * 60 * 60 * 1000),
          },
        });
      }
    }
    console.log("✅ Dummy subscribers seeded");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupSuperAdmin();
