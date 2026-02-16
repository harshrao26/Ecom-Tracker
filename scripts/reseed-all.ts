import * as dotenv from "dotenv";
import path from "path";

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function reseedAll() {
  try {
    const { default: connectDB } = await import("../src/lib/db/connection");
    const { default: User } = await import("../src/lib/db/models/User");
    const { default: Store } = await import("../src/lib/db/models/Store");
    const { default: AnalyticsData } = await import("../src/lib/db/models/AnalyticsData");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear all existing demo/test data
    console.log("🗑️  Cleaning database...");
    const demoEmails = [
      "harshurao058@gmail.com",
      "growth_user@example.com",
      "starter_user@example.com",
      "free_user@example.com",
      "expired_user@example.com",
      "demo@example.com"
    ];
    
    await User.deleteMany({ email: { $in: demoEmails } });
    await Store.deleteMany({});
    await AnalyticsData.deleteMany({});
    console.log("✅ Database cleaned");

    const usersToCreate = [
      {
        name: "Harsh Rao",
        email: "harshurao058@gmail.com",
        password: "Harsh@7233",
        role: "super-admin",
        plan: "enterprise",
        status: "active"
      },
      {
        name: "Growth Merchant",
        email: "growth_user@example.com",
        password: "password123",
        role: "user",
        plan: "growth",
        status: "active"
      },
      {
        name: "Starter Merchant",
        email: "starter_user@example.com",
        password: "password123",
        role: "user",
        plan: "starter",
        status: "active"
      },
      {
        name: "Free Merchant",
        email: "free_user@example.com",
        password: "password123",
        role: "user",
        plan: "free",
        status: "active"
      },
      {
        name: "Inactive Merchant",
        email: "expired_user@example.com",
        password: "password123",
        role: "user",
        plan: "starter",
        status: "expired"
      }
    ];

    const PRODUCTS = [
      { id: "P1", name: "Cotton T-Shirt", category: "Apparel", price: 499, cost: 200, sku: "TSH-COT-001" },
      { id: "P2", name: "Leather Wallet", category: "Accessories", price: 699, cost: 250, sku: "WAL-LTH-002" },
      { id: "P3", name: "Smart Watch", category: "Electronics", price: 3999, cost: 2000, sku: "WTC-SMR-003" },
      { id: "P4", name: "Sports Shoes", category: "Footwear", price: 1999, cost: 800, sku: "SHO-SPT-004" },
      { id: "P5", name: "Wireless Buds", category: "Electronics", price: 2499, cost: 1200, sku: "AUD-WLS-005" }
    ];

    console.log("👤 Creating demo users and data...");

    for (const userData of usersToCreate) {
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        language: "en",
        subscription: {
          plan: userData.plan,
          status: userData.status,
          startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        }
      });

      // Create a store for each user
      const store = await Store.create({
        userId: user._id,
        name: `${userData.name}'s Shop`,
        platform: "shopify",
        platformStoreId: `shop_${user._id.toString().substring(0, 8)}`,
        isActive: true,
        syncStatus: { status: "active", lastSync: new Date() }
      });

      // Generate 90 days of analytics data
      const analyticsRecords = [];
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 90);

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Daily orders (random based on plan)
        const orderCount = userData.plan === "enterprise" || userData.plan === "growth" ? 15 : 5;
        const orders = [];
        
        for (let i = 0; i < orderCount; i++) {
          const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
          const qty = Math.floor(Math.random() * 2) + 1;
          const total = product.price * qty;
          const gst = total * 0.12;

          orders.push({
            orderId: `ORD-${user._id.toString().substring(0, 4)}-${currentDate.getTime()}-${i}`,
            platformOrderId: `pf_${currentDate.getTime()}_${i}`,
            date: new Date(currentDate),
            total: total + gst,
            status: Math.random() < 0.1 ? "returned" : "completed",
            paymentMethod: Math.random() < 0.4 ? "cod" : "prepaid",
            customer: {
              id: `CUST-${i}`,
              name: "Customer " + i,
              email: `cust${i}@example.com`,
              city: "Delhi",
              state: "Delhi",
              pincode: "110001",
              tier: "tier1"
            },
            items: [{
              productId: product.id,
              name: product.name,
              sku: product.sku,
              quantity: qty,
              price: product.price,
              cost: product.cost
            }],
            costs: { 
              subtotal: total, 
              gstAmount: gst, 
              total: total + gst,
              cgst: gst/2,
              sgst: gst/2,
              igst: 0,
              shippingCost: 50,
              paymentGatewayFee: total * 0.02
            }
          });
        }

        analyticsRecords.push({
          storeId: store._id,
          date: new Date(currentDate),
          orders,
          products: PRODUCTS.map(p => ({
            productId: p.id,
            sku: p.sku,
            name: p.name,
            category: p.category,
            price: p.price,
            cost: p.cost,
            stock: 100,
            unitsSold: Math.floor(Math.random() * 20),
            revenue: p.price * 10
          })),
          customers: [] // Can populate if needed
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      await AnalyticsData.insertMany(analyticsRecords);
      console.log(`   ✅ Created ${userData.email} with ${analyticsRecords.length} days of data`);
    }

    console.log("\n🎉 ALL DEMO ACCOUNTS RESEEDED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Reseed failed:", error);
    process.exit(1);
  }
}

reseedAll();
