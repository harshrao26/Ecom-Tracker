/**
 * Analytics Data Aggregator
 * Fetches and aggregates data from MongoDB
 */

import mongoose from "mongoose";
import AnalyticsData from "../db/models/AnalyticsData";
import Store from "../db/models/Store";

interface FetchParams {
  userId: string;
  storeId: string;
  startDate: string;
  endDate: string;
}

export class AnalyticsAggregator {
  /**
   * Main function to fetch all analytics data
   */
  static async fetchAnalyticsData(params: FetchParams) {
    // Get user's stores
    const stores = await this.getUserStores(params.userId, params.storeId);

    if (stores.length === 0) {
      throw new Error("No stores found for this user");
    }

    // Fetch all data in parallel
    const [orders, products, customers] = await Promise.all([
      this.fetchOrders(stores, params.startDate, params.endDate),
      this.fetchProducts(stores, params.startDate, params.endDate),
      this.fetchCustomers(stores, params.startDate, params.endDate),
    ]);

    return { orders, products, customers };
  }

  /**
   * Get user's stores (filtered by storeId if provided)
   */
  static async getUserStores(userId: string, storeId: string = "all") {
    try {
      // Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(
          `⚠️ Invalid ObjectId for userId: ${userId}, returning empty array`,
        );
        return [];
      }

      const query: any = {
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true,
      };

      // If specific store requested
      if (storeId !== "all") {
        query._id = storeId;
      }

      const stores = await Store.find(query).select("_id name platform");
      return stores.map((s) => s._id.toString());
    } catch (error) {
      console.error("❌ Error in getUserStores:", error);
      return [];
    }
  }

  /**
   * Fetch orders data
   */
  static async fetchOrders(
    storeIds: string[],
    startDate: string,
    endDate: string,
  ) {
    const result = await AnalyticsData.aggregate([
      // STEP 1: Filter by stores and date range
      {
        $match: {
          storeId: {
            $in: storeIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // STEP 2: Unwind orders array
      {
        $unwind: "$orders",
      },

      // STEP 3: Project required fields
      {
        $project: {
          _id: 0,
          orderId: "$orders.orderId",
          platformOrderId: "$orders.platformOrderId",
          date: "$orders.date",
          total: "$orders.total",
          status: "$orders.status",
          returnReason: "$orders.returnReason",
          paymentMethod: "$orders.paymentMethod",
          customer: "$orders.customer",
          items: "$orders.items",
          costs: "$orders.costs",
        },
      },

      // STEP 4: Sort by date
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  }

  /**
   * Fetch products data with aggregated metrics
   */
  static async fetchProducts(
    storeIds: string[],
    startDate: string,
    endDate: string,
  ) {
    const result = await AnalyticsData.aggregate([
      // Match stores and date range
      {
        $match: {
          storeId: {
            $in: storeIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // Unwind products
      {
        $unwind: "$products",
      },

      // Group by product to calculate metrics
      {
        $group: {
          _id: "$products.productId",
          name: { $first: "$products.name" },
          category: { $first: "$products.category" },
          price: { $avg: "$products.price" },
          cost: { $avg: "$products.cost" },
          totalRevenue: { $sum: "$products.revenue" },
          totalUnits: { $sum: "$products.unitsSold" },
          currentStock: { $last: "$products.stock" },
        },
      },

      // Calculate profit
      {
        $addFields: {
          productId: "$_id",
          totalProfit: {
            $subtract: [
              "$totalRevenue",
              { $multiply: ["$cost", "$totalUnits"] },
            ],
          },
        },
      },

      // Sort by revenue
      {
        $sort: { totalRevenue: -1 },
      },

      // Project final fields
      {
        $project: {
          _id: 0,
          productId: 1,
          name: 1,
          category: 1,
          price: 1,
          cost: 1,
          totalRevenue: 1,
          totalUnits: 1,
          totalProfit: 1,
          currentStock: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * Fetch customers data with aggregated metrics
   */
  static async fetchCustomers(
    storeIds: string[],
    startDate: string,
    endDate: string,
  ) {
    const result = await AnalyticsData.aggregate([
      // Match stores and date range
      {
        $match: {
          storeId: {
            $in: storeIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // Unwind customers
      {
        $unwind: "$customers",
      },

      // Group by customer
      {
        $group: {
          _id: "$customers.customerId",
          customerId: { $first: "$customers.customerId" },
          email: { $first: "$customers.email" },
          name: { $first: "$customers.name" },
          city: { $first: "$customers.city" },
          state: { $first: "$customers.state" },
          totalOrders: { $sum: "$customers.totalOrders" },
          totalSpent: { $sum: "$customers.totalSpent" },
          firstOrderDate: { $min: "$customers.firstOrderDate" },
          lastOrderDate: { $max: "$customers.lastOrderDate" },
        },
      },

      // Sort by total spent
      {
        $sort: { totalSpent: -1 },
      },

      // Project final fields
      {
        $project: {
          _id: 0,
          customerId: 1,
          email: 1,
          name: 1,
          city: 1,
          state: 1,
          totalOrders: 1,
          totalSpent: 1,
          firstOrderDate: 1,
          lastOrderDate: 1,
        },
      },
    ]);

    return result;
  }

  /**
   * Fetch regional data
   */
  static async fetchRegionalData(
    storeIds: string[],
    startDate: string,
    endDate: string,
  ) {
    const result = await AnalyticsData.aggregate([
      // Match filters
      {
        $match: {
          storeId: {
            $in: storeIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },

      // Unwind orders
      {
        $unwind: "$orders",
      },

      // Group by city
      {
        $group: {
          _id: {
            city: "$orders.customer.city",
            state: "$orders.customer.state",
          },
          totalRevenue: { $sum: "$orders.total" },
          totalOrders: { $sum: 1 },
          uniqueCustomers: { $addToSet: "$orders.customer.id" },
        },
      },

      // Calculate AOV
      {
        $addFields: {
          aov: { $divide: ["$totalRevenue", "$totalOrders"] },
          customerCount: { $size: "$uniqueCustomers" },
        },
      },

      // Format output
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          state: "$_id.state",
          revenue: "$totalRevenue",
          orders: "$totalOrders",
          customers: "$customerCount",
          aov: { $round: ["$aov", 2] },
        },
      },

      // Sort by revenue
      {
        $sort: { revenue: -1 },
      },

      // Limit to top 15 cities
      {
        $limit: 15,
      },
    ]);

    return result;
  }
}

export default AnalyticsAggregator;
