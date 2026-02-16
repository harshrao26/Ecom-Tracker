import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local IMMEDIATELY
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Demo user credentials
const DEMO_USER = {
  email: "demo@example.com",
  password: "$2a$10$demo.password.hash", // Replace with actual bcrypt hash if needed
  name: "Demo User",
  phone: "+919876543210",
  language: "hinglish" as const,
};

// Indian cities for realistic data
const INDIAN_CITIES = [
  { city: "Mumbai", state: "Maharashtra", tier: 1 },
  { city: "Delhi", state: "Delhi", tier: 1 },
  { city: "Bangalore", state: "Karnataka", tier: 1 },
  { city: "Pune", state: "Maharashtra", tier: 1 },
  { city: "Ahmedabad", state: "Gujarat", tier: 1 },
  { city: "Jaipur", state: "Rajasthan", tier: 2 },
  { city: "Lucknow", state: "Uttar Pradesh", tier: 2 },
  { city: "Chandigarh", state: "Chandigarh", tier: 2 },
  { city: "Indore", state: "Madhya Pradesh", tier: 2 },
  { city: "Bhopal", state: "Madhya Pradesh", tier: 3 },
];

// Product categories
const PRODUCTS = [
  { name: "Men Cotton T-Shirt", category: "Apparel", price: 499, cost: 200 },
  { name: "Women Kurti", category: "Apparel", price: 899, cost: 350 },
  { name: "Leather Wallet", category: "Accessories", price: 699, cost: 250 },
  { name: "Sports Shoes", category: "Footwear", price: 1999, cost: 800 },
  {
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 2499,
    cost: 1200,
  },
  { name: "Smart Watch", category: "Electronics", price: 3999, cost: 2000 },
  { name: "Backpack", category: "Accessories", price: 1299, cost: 500 },
  { name: "Yoga Mat", category: "Sports", price: 799, cost: 300 },
  { name: "Water Bottle", category: "Sports", price: 399, cost: 150 },
  { name: "Phone Case", category: "Accessories", price: 299, cost: 100 },
];

// Customer names
const CUSTOMER_NAMES = [
  "Rahul Sharma",
  "Priya Patel",
  "Amit Kumar",
  "Sneha Singh",
  "Rajesh Gupta",
  "Neha Verma",
  "Vikram Reddy",
  "Anjali Mehta",
  "Arjun Nair",
  "Pooja Desai",
  "Karan Malhotra",
  "Riya Kapoor",
];

// Return reasons
const RETURN_REASONS = [
  "Size/Fit Issue",
  "Damaged Product",
  "Wrong Item Received",
  "Quality Not as Expected",
  "Better Price Elsewhere",
  "Changed Mind",
  "RTO - Customer Not Available",
  "RTO - Refused Delivery",
  "RTO - Incorrect Address",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateOrders(count: number, startDate: Date, endDate: Date) {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const location = randomElement(INDIAN_CITIES);
    const product = randomElement(PRODUCTS);
    const quantity = randomInt(1, 3);
    const isCOD = Math.random() < 0.4; // 40% COD

    const subtotal = product.price * quantity;
    const shippingCost = isCOD ? 50 : 0;

    // GST calculation
    let gstRate = 0.18; // 18% for most products
    if (product.category === "Apparel") gstRate = 0.05; // 5% for apparel
    if (product.category === "Electronics") gstRate = 0.18; // 18% for electronics

    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount + shippingCost;

    const isInterstate = Math.random() < 0.3;
    const cgst = isInterstate ? 0 : gstAmount / 2;
    const sgst = isInterstate ? 0 : gstAmount / 2;
    const igst = isInterstate ? gstAmount : 0;

    // Status and Return logic
    let status = randomElement([
      "completed",
      "completed",
      "completed",
      "completed",
      "pending",
      "cancelled",
      "returned",
      "rto",
    ]);

    // Prepaid orders have lower RTO/Return rates in India
    const paymentMethod = isCOD ? "cod" : "prepaid";
    if (paymentMethod === "prepaid" && (status === "returned" || status === "rto")) {
      if (Math.random() < 0.7) status = "completed"; // 70% chance to flip back to completed if prepaid
    }

    let returnReason = undefined;
    if (status === "returned") {
      returnReason = randomElement(
        RETURN_REASONS.filter((r) => !r.startsWith("RTO")),
      );
    } else if (status === "rto") {
      returnReason = randomElement(
        RETURN_REASONS.filter((r) => r.startsWith("RTO")),
      );
    }

    orders.push({
      orderId: `ORD-${Date.now()}-${i}`,
      platformOrderId: `${randomInt(1000, 9999)}`,
      date: randomDate(startDate, endDate),
      total,
      status,
      returnReason,
      paymentMethod: isCOD ? "cod" : "prepaid",
      customer: {
        id: `CUST-${randomInt(1000, 9999)}`,
        email: `customer${randomInt(1, 100)}@example.com`,
        name: randomElement(CUSTOMER_NAMES),
        phone: `+91${randomInt(7000000000, 9999999999)}`,
        city: location.city,
        state: location.state,
        pincode: `${randomInt(100000, 999999)}`,
      },
      items: [
        {
          productId: `PROD-${randomInt(1000, 9999)}`,
          name: product.name,
          sku: `SKU-${product.category}-${randomInt(100, 999)}`,
          quantity,
          price: product.price,
          cost: product.cost,
        },
      ],
      costs: {
        subtotal,
        shipping: shippingCost,
        tax: gstAmount,
        discount: 0,
        total,
        gst: {
          cgst,
          sgst,
          igst,
          total: gstAmount,
        },
      },
    });
  }

  return orders;
}

function generateProducts() {
  return PRODUCTS.map((p, i) => ({
    productId: `PROD-${1000 + i}`,
    name: p.name,
    sku: `SKU-${p.category}-${100 + i}`,
    category: p.category,
    price: p.price,
    cost: p.cost,
    stock: randomInt(10, 200),
    unitsSold: randomInt(5, 50),
    revenue: p.price * randomInt(5, 50),
  }));
}

function generateCustomers(orderCount: number) {
  const customers = [];
  const customerCount = Math.min(orderCount, CUSTOMER_NAMES.length);

  for (let i = 0; i < customerCount; i++) {
    const location = randomElement(INDIAN_CITIES);
    const totalOrders = randomInt(1, 5);
    const totalSpent = randomInt(1000, 10000);

    customers.push({
      customerId: `CUST-${1000 + i}`,
      email: `${CUSTOMER_NAMES[i].toLowerCase().replace(" ", ".")}@example.com`,
      name: CUSTOMER_NAMES[i],
      phone: `+91${randomInt(7000000000, 9999999999)}`,
      city: location.city,
      state: location.state,
      totalOrders,
      totalSpent,
      firstOrderDate: new Date(
        Date.now() - randomInt(30, 90) * 24 * 60 * 60 * 1000,
      ),
      lastOrderDate: new Date(
        Date.now() - randomInt(1, 15) * 24 * 60 * 60 * 1000,
      ),
    });
  }

  return customers;
}

async function seedDatabase() {
  try {
    console.log("🚀 Starting demo data seeding...");

    // Dynamic imports to ensure dotenv.config() has run first
    const connectDB = (await import("../src/lib/db/connection")).default;
    const User = (await import("../src/lib/db/models/User")).default;
    const Store = (await import("../src/lib/db/models/Store")).default;
    const AnalyticsData = (await import("../src/lib/db/models/AnalyticsData"))
      .default;

    // Connect to MongoDB
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing demo data
    console.log("🗑️  Clearing existing demo data...");
    await User.deleteOne({ email: DEMO_USER.email });
    await Store.deleteMany({ userId: { $exists: true } });
    await AnalyticsData.deleteMany({});

    // Create demo user
    console.log("👤 Creating demo user...");
    const user = await User.create({
      ...DEMO_USER,
      subscription: {
        plan: "growth",
        status: "active",
        startDate: new Date(),
      },
      limits: {
        maxStores: 10,
        maxOrders: -1,
        historicalDataMonths: -1,
        aiInsights: true,
      },
    });
    console.log(`   ✅ User created: ${user.email} (ID: ${user._id})`);

    // Create stores
    console.log("🏪 Creating demo stores...");
    const shopifyStore = new Store({
      userId: user._id,
      name: "Fashion Paradise (Shopify)",
      platform: "shopify",
      platformStoreId: "shopify-store-123",
      isActive: true,
      syncStatus: { status: "active", lastSync: new Date() },
    });
    shopifyStore.saveEncryptedCredentials({
      shopUrl: "fashion-paradise.myshopify.com",
      accessToken: "demo-token-placeholder",
    });
    await shopifyStore.save();

    const wooStore = new Store({
      userId: user._id,
      name: "TechHub India (WooCommerce)",
      platform: "woocommerce",
      platformStoreId: "woo-store-456",
      isActive: true,
      syncStatus: { status: "active", lastSync: new Date() },
    });
    wooStore.saveEncryptedCredentials({
      siteUrl: "https://techhub-india.com",
      consumerKey: "ck_demo_key_placeholder",
      consumerSecret: "cs_demo_secret_placeholder",
    });
    await wooStore.save();

    const stores = [shopifyStore, wooStore];
    console.log(
      `   ✅ Created ${stores.length} stores with encrypted credentials`,
    );

    // Generate analytics data for last 90 days
    console.log("📊 Generating analytics data...");
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    // Generate daily data
    const analyticsData = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      for (const store of stores) {
        const ordersPerDay = randomInt(5, 20);
        const orders = generateOrders(ordersPerDay, currentDate, currentDate);
        const products = generateProducts();
        const customers = generateCustomers(ordersPerDay);

        analyticsData.push({
          storeId: store._id,
          date: new Date(currentDate),
          orders,
          products,
          customers,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    await AnalyticsData.insertMany(analyticsData);
    console.log(`   ✅ Created ${analyticsData.length} analytics records`);

    // Summary
    console.log("\n🎉 Demo data seeding completed!");
    console.log("━".repeat(50));
    console.log(`📧 Demo User Email: ${user.email}`);
    console.log(`🆔 User ID: ${user._id}`);
    console.log(`🏪 Stores: ${stores.length}`);
    console.log(`📊 Analytics Days: 90`);
    console.log(`📦 Total Records: ${analyticsData.length}`);
    console.log("━".repeat(50));
    console.log("\n📱 Test the dashboard:");
    console.log(`   http://localhost:3000/dashboard?userId=${user._id}`);
    console.log("\n💡 Or update your dashboard to use this userId:");
    console.log(`   const userId = "${user._id}";`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
