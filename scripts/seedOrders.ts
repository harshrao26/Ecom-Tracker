/**
 * Seed Script - Add Sample Orders and Subscriptions
 * Run with: npm run seed
 */

import mongoose from "mongoose";
import connectDB from "../src/lib/db/connection";
import User from "../src/lib/db/models/User";
import Order from "../src/lib/db/models/Order";
import Subscription from "../src/lib/db/models/Subscription";

const plans = ["Starter", "Pro", "Enterprise"];
const statuses = ["completed", "completed", "completed", "pending", "failed"]; // More completed
const amounts: Record<string, number> = {
  Starter: 99,
  Pro: 199,
  Enterprise: 499,
};

async function seedData() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    // Get all users
    const users = await User.find().lean();

    if (users.length === 0) {
      console.log("❌ No users found. Please create users first.");
      process.exit(1);
    }

    console.log(`📊 Found ${users.length} users`);

    // Clear existing orders and subscriptions
    await Order.deleteMany({});
    await Subscription.deleteMany({});
    console.log("🗑️  Cleared existing orders and subscriptions");

    const orders = [];
    const subscriptions = [];

    // Create orders and subscriptions for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const plan = plans[i % plans.length];
      const amount = amounts[plan];

      // Create 1-5 orders per user
      const orderCount = Math.floor(Math.random() * 5) + 1;

      for (let j = 0; j < orderCount; j++) {
        const daysAgo = Math.floor(Math.random() * 180); // Last 6 months
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        const order = {
          userId: user._id,
          customerName: user.name,
          customerEmail: user.email,
          amount,
          currency: "USD",
          plan,
          status,
          paymentMethod: "card",
          transactionId: `txn_${Date.now()}_${i}_${j}`,
          createdAt,
          completedAt: status === "completed" ? createdAt : null,
        };

        orders.push(order);
      }

      // Create subscription for active users (80% chance)
      if (Math.random() > 0.2) {
        const subscriptionStatus =
          Math.random() > 0.15 ? "active" : "cancelled";
        const billingCycle = Math.random() > 0.3 ? "monthly" : "yearly";
        const subscriptionAmount =
          billingCycle === "monthly" ? amount : amount * 10; // 10 months discount for yearly

        const startDate = new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
        );

        const subscription = {
          userId: user._id,
          plan: plan.toLowerCase(),
          status: subscriptionStatus,
          billingCycle,
          amount: subscriptionAmount,
          currency: "USD",
          startDate,
          nextBillingDate:
            subscriptionStatus === "active"
              ? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
              : null,
          autoRenew: subscriptionStatus === "active",
          paymentHistory: [
            {
              razorpayPaymentId: `pay_${Date.now()}_${i}`,
              amount: subscriptionAmount,
              status: "success",
              paidAt: startDate,
            },
          ],
        };

        subscriptions.push(subscription);
      }
    }

    // Insert orders
    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log(`✅ Created ${orders.length} orders`);
    }

    // Insert subscriptions
    if (subscriptions.length > 0) {
      await Subscription.insertMany(subscriptions);
      console.log(`✅ Created ${subscriptions.length} subscriptions`);
    }

    // Summary
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.amount, 0);

    const activeSubsCount = subscriptions.filter(
      (s) => s.status === "active",
    ).length;
    const mrr = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => {
        if (s.billingCycle === "monthly") return sum + s.amount;
        if (s.billingCycle === "yearly") return sum + s.amount / 12;
        return sum;
      }, 0);

    console.log("\n📈 Summary:");
    console.log(`   Total Orders: ${orders.length}`);
    console.log(
      `   Completed Orders: ${orders.filter((o) => o.status === "completed").length}`,
    );
    console.log(`   Total Revenue: $${totalRevenue.toLocaleString()}`);
    console.log(`   Active Subscriptions: ${activeSubsCount}`);
    console.log(`   MRR: $${Math.round(mrr).toLocaleString()}`);
    console.log(`   ARR: $${Math.round(mrr * 12).toLocaleString()}`);

    console.log("\n✨ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

// Run seed
seedData();
