/**
 * Analytics Engine
 * Core analytics processing and calculations based on ANALYTICS_PAGE_ARCHITECTURE.md
 */

interface Order {
  orderId: string;
  date: Date;
  total: number;
  status: string;
  paymentMethod: "prepaid" | "cod";
  customer: {
    id: string;
    city: string;
    state: string;
    tier: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    cost: number;
  }>;
  costs: {
    platformFee: number;
    paymentGatewayFee: number;
    shippingCost: number;
    discount: number;
    gstAmount: number;
  };
}

interface Product {
  productId: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  totalRevenue: number;
  totalUnits: number;
  totalProfit: number;
}

interface Customer {
  customerId: string;
  name?: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  segment?: string;
}

export class AnalyticsEngine {
  /**
   * Calculate overview metrics (revenue, profit, AOV, etc.)
   */
  static calculateOverview(orders: Order[], previousOrders: Order[] = []) {
    // Current period metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate total profit (revenue - costs - COGS)
    const totalProfit = orders.reduce((sum, order) => {
      // Calculate COGS (Cost of Goods Sold)
      const cogs = order.items.reduce((itemSum, item) => {
        return itemSum + item.cost * item.quantity;
      }, 0);

      // Calculate order profit
      const orderRevenue = order.total;
      const orderCosts =
        cogs +
        order.costs.platformFee +
        order.costs.paymentGatewayFee +
        order.costs.shippingCost;

      return sum + (orderRevenue - orderCosts);
    }, 0);

    const profitMargin =
      totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Previous period metrics for growth calculation
    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.total, 0);
    const previousOrderCount = previousOrders.length;
    const previousAov =
      previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;
    const previousProfit = previousOrders.reduce((sum, order) => {
      return sum + this.calculateOrderProfit(order);
    }, 0);

    // Growth calculations
    const revenueGrowth = this.calculateGrowthRate(
      totalRevenue,
      previousRevenue,
    );
    const ordersGrowth = this.calculateGrowthRate(
      totalOrders,
      previousOrderCount,
    );
    const aovGrowth = this.calculateGrowthRate(aov, previousAov);
    const profitGrowth = this.calculateGrowthRate(totalProfit, previousProfit);

    return {
      totalRevenue: Math.round(totalRevenue),
      totalOrders,
      averageOrderValue: Math.round(aov),
      totalProfit: Math.round(totalProfit),
      profitMargin: Math.round(profitMargin * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      aovGrowth: Math.round(aovGrowth * 100) / 100,
      profitGrowth: Math.round(profitGrowth * 100) / 100,
    };
  }

  /**
   * Calculate growth rate percentage
   */
  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Group orders by time period (day/week/month)
   */
  static groupByPeriod(
    orders: Order[],
    period: "day" | "week" | "month" = "day",
  ) {
    const grouped = new Map<string, any>();

    orders.forEach((order) => {
      const dateKey = this.getDateKey(order.date, period);

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, {
          date: dateKey,
          revenue: 0,
          orders: 0,
          profit: 0,
        });
      }

      const group = grouped.get(dateKey)!;
      group.revenue += order.total;
      group.orders += 1;
      group.profit += this.calculateOrderProfit(order);
    });

    // Convert to array and sort by date
    return Array.from(grouped.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  /**
   * Get date key for grouping
   */
  static getDateKey(date: Date, period: string): string {
    const d = new Date(date);

    switch (period) {
      case "day":
        return d.toISOString().split("T")[0]; // "2024-01-15"
      case "week":
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return weekStart.toISOString().split("T")[0];
      case "month":
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      default:
        return d.toISOString().split("T")[0];
    }
  }

  /**
   * Calculate profit for a single order
   */
  static calculateOrderProfit(order: Order): number {
    const cogs = order.items.reduce((sum, item) => {
      return sum + item.cost * item.quantity;
    }, 0);

    const costs =
      cogs +
      order.costs.platformFee +
      order.costs.paymentGatewayFee +
      order.costs.shippingCost;

    return order.total - costs;
  }

  /**
   * Analyze by region (city/state)
   */
  static analyzeByRegion(orders: Order[]) {
    const grouped = new Map<string, any>();

    orders.forEach((order) => {
      const key = `${order.customer.city}:${order.customer.state}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          city: order.customer.city,
          state: order.customer.state,
          revenue: 0,
          orders: 0,
          customers: new Set<string>(),
          profit: 0,
        });
      }

      const group = grouped.get(key)!;
      group.revenue += order.total;
      group.orders += 1;
      group.customers.add(order.customer.id);
      group.profit += this.calculateOrderProfit(order);
    });

    // Convert to array with calculated metrics
    return Array.from(grouped.values())
      .map((group) => ({
        city: group.city,
        state: group.state,
        revenue: Math.round(group.revenue),
        orders: group.orders,
        customers: group.customers.size,
        aov: Math.round(group.revenue / group.orders),
        profit: Math.round(group.profit),
        profitMargin: Math.round((group.profit / group.revenue) * 10000) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 15); // Top 15 cities
  }

  /**
   * Get top products by revenue
   */
  static getTopProducts(products: Product[], limit: number = 10) {
    return products
      .map((product) => {
        const profitMargin =
          product.price > 0
            ? ((product.price - product.cost) / product.price) * 100
            : 0;

        return {
          id: product.productId,
          name: product.name,
          category: product.category,
          revenue: Math.round(product.totalRevenue),
          units: product.totalUnits,
          profit: Math.round(product.totalProfit),
          profitMargin: Math.round(profitMargin * 100) / 100,
          avgPrice: Math.round(product.price),
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  /**
   * Segment customers (VIP, Regular, At-Risk, Churned)
   */
  static segmentCustomers(customers: Customer[]) {
    const now = new Date();
    const segments = {
      vip: [] as any[],
      regular: [] as any[],
      atRisk: [] as any[],
      churned: [] as any[],
    };

    customers.forEach((customer) => {
      const daysSinceLastOrder = Math.floor(
        (now.getTime() - new Date(customer.lastOrderDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      let segment = "regular";

      // VIP: >5 orders and >₹50,000 total spent
      if (customer.totalOrders > 5 && customer.totalSpent > 50000) {
        segment = "vip";
      }
      // At-Risk: No order in last 60 days but ordered before
      else if (daysSinceLastOrder > 60 && daysSinceLastOrder <= 180) {
        segment = "atRisk";
      }
      // Churned: No order in last 180 days
      else if (daysSinceLastOrder > 180) {
        segment = "churned";
      }

      segments[segment as keyof typeof segments].push({
        customerId: customer.customerId,
        totalOrders: customer.totalOrders,
        totalSpent: Math.round(customer.totalSpent),
        daysSinceLastOrder,
        segment,
      });
    });

    return {
      vip: segments.vip.length,
      regular: segments.regular.length,
      atRisk: segments.atRisk.length,
      churned: segments.churned.length,
      vipCustomers: segments.vip,
      atRiskCustomers: segments.atRisk,
    };
  }

  /**
   * Analyze COD vs Prepaid (India-specific)
   */
  static analyzeCOD(orders: Order[]) {
    const codOrders = orders.filter((o) => o.paymentMethod === "cod");
    const prepaidOrders = orders.filter((o) => o.paymentMethod === "prepaid");

    const codRevenue = codOrders.reduce((sum, o) => sum + o.total, 0);
    const prepaidRevenue = prepaidOrders.reduce((sum, o) => sum + o.total, 0);

    // City-wise COD preference
    const cityWise = new Map<string, any>();

    orders.forEach((order) => {
      const city = order.customer.city;
      if (!cityWise.has(city)) {
        cityWise.set(city, { cod: 0, prepaid: 0 });
      }

      const data = cityWise.get(city)!;
      if (order.paymentMethod === "cod") {
        data.cod += 1;
      } else {
        data.prepaid += 1;
      }
    });

    const cityPreferences = Array.from(cityWise.entries())
      .map(([city, data]) => ({
        city,
        codPercentage: Math.round((data.cod / (data.cod + data.prepaid)) * 100),
        totalOrders: data.cod + data.prepaid,
      }))
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 10);

    return {
      codRevenue: Math.round(codRevenue),
      prepaidRevenue: Math.round(prepaidRevenue),
      codOrders: codOrders.length,
      prepaidOrders: prepaidOrders.length,
      codPercentage:
        orders.length > 0
          ? Math.round((codOrders.length / orders.length) * 100)
          : 0,
      cityWiseCODPreference: cityPreferences,
    };
  }

  /**
   * Calculate SKU-level profitability
   */
  static calculateSKUProfitability(products: Product[]) {
    return products
      .map((product) => {
        const profit = product.totalRevenue - product.cost * product.totalUnits;
        const profitMargin =
          product.totalRevenue > 0 ? (profit / product.totalRevenue) * 100 : 0;

        return {
          productId: product.productId,
          name: product.name,
          category: product.category,
          revenue: Math.round(product.totalRevenue),
          profit: Math.round(profit),
          profitMargin: Math.round(profitMargin * 100) / 100,
          units: product.totalUnits,
          avgSellingPrice: Math.round(product.price),
          costPerUnit: Math.round(product.cost),
        };
      })
      .sort((a, b) => b.profit - a.profit);
  }

  /**
   * Analyze order status distribution
   */
  static analyzeOrderStatus(orders: Order[]) {
    const statusGroups = new Map<string, number>();

    orders.forEach((order) => {
      const status = order.status;
      statusGroups.set(status, (statusGroups.get(status) || 0) + 1);
    });

    return Array.from(statusGroups.entries())
      .map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / orders.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Analyze inventory health (Fast/Slow moving, Out of Stock)
   */
  static analyzeInventoryHealth(products: Product[]) {
    const totalProducts = products.length;
    if (totalProducts === 0) {
      return { fastMoving: 0, slowMoving: 0, outOfStock: 0 };
    }

    const outOfStock = products.filter((p) => (p as any).stock <= 0).length;

    // Fast moving: top 20% by units sold
    // Slow moving: bottom 20% by units sold (but > 0 stock)
    const sortedByUnits = [...products].sort(
      (a, b) => b.totalUnits - a.totalUnits,
    );
    const topThreshold = Math.ceil(totalProducts * 0.2);
    const bottomThreshold = Math.ceil(totalProducts * 0.8);

    const fastMoving = sortedByUnits.slice(0, topThreshold).length;
    const slowMoving = sortedByUnits.filter(
      (p, i) => i >= bottomThreshold && (p as any).stock > 0,
    ).length;

    return {
      fastMoving,
      slowMoving,
      outOfStock,
    };
  }

  /**
   * Analyze category distribution
   */
  static analyzeCategories(products: Product[]) {
    const categoryGroups = new Map<string, number>();

    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      categoryGroups.set(category, (categoryGroups.get(category) || 0) + 1);
    });

    return Array.from(categoryGroups.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Analyze performance by state
   */
  static analyzeByState(orders: Order[]) {
    const stateGroups = new Map<string, any>();

    orders.forEach((order) => {
      const state = order.customer.state;
      if (!stateGroups.has(state)) {
        stateGroups.set(state, {
          state,
          revenue: 0,
          orders: 0,
        });
      }

      const group = stateGroups.get(state)!;
      group.revenue += order.total;
      group.orders += 1;
    });

    return Array.from(stateGroups.values())
      .map((group) => ({
        name: group.state,
        revenue: Math.round(group.revenue),
        orders: group.orders,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Analyze price range distribution
   */
  static analyzePriceRanges(products: Product[]) {
    const ranges = [
      { min: 0, max: 500, label: "0-500" },
      { min: 501, max: 1000, label: "501-1000" },
      { min: 1001, max: 2000, label: "1001-2000" },
      { min: 2001, max: 5000, label: "2001-5000" },
      { min: 5001, max: Infinity, label: "5000+" },
    ];

    const distribution = ranges.map((r) => ({
      name: r.label,
      revenue: 0,
      count: 0,
    }));

    products.forEach((product) => {
      const price = product.price;
      const range = distribution.find((d, i) => {
        const r = ranges[i];
        return price >= r.min && price <= r.max;
      });

      if (range) {
        range.revenue += product.totalRevenue;
        range.count += product.totalUnits;
      }
    });

    return distribution;
  }

  /**
   * Analyze discount effectiveness
   */
  static analyzeDiscountEffectiveness(orders: Order[]) {
    // Group by discount percentage buckets: 0%, 1-10%, 11-20%, etc.
    const buckets = [
      { min: 0, max: 0, label: "0%" },
      { min: 1, max: 10, label: "1-10%" },
      { min: 11, max: 20, label: "11-20%" },
      { min: 21, max: 30, label: "21-30%" },
      { min: 31, max: 50, label: "31-50%" },
      { min: 51, max: 100, label: "50%+" },
    ];

    const analysis = buckets.map((b) => ({
      name: b.label,
      revenue: 0,
      orders: 0,
    }));

    orders.forEach((order) => {
      const discountAmount = order.costs.discount || 0;
      const totalBeforeDiscount = order.total + discountAmount;
      const discountPercentage =
        totalBeforeDiscount > 0
          ? Math.round((discountAmount / totalBeforeDiscount) * 100)
          : 0;

      const bucket = analysis.find((a, i) => {
        const b = buckets[i];
        return discountPercentage >= b.min && discountPercentage <= b.max;
      });

      if (bucket) {
        bucket.revenue += order.total;
        bucket.orders += 1;
      }
    });

    return analysis;
  }

  /**
   * Generate pricing strategy recommendations
   */
  static generatePricingStrategy(products: Product[]) {
    return products
      .map((product) => {
        const margin =
          product.price > 0
            ? ((product.price - product.cost) / product.price) * 100
            : 0;

        let action = "Optimal";
        if (margin < 15) action = "Underpriced";
        if (margin > 50 && product.totalUnits < 5) action = "Overpriced";
        if (margin < 0) action = "Unprofitable";

        return {
          productId: product.productId,
          name: product.name,
          avgPrice: Math.round(product.price),
          sold: product.totalUnits,
          revenue: Math.round(product.totalRevenue),
          margin: Math.round(margin * 10) / 10,
          action,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }

  /**
   * Analyze customer purchase frequency
   */
  static analyzeCustomerPurchaseFrequency(customers: Customer[]) {
    const frequency = {
      "1 Order": 0,
      "2 Orders": 0,
      "3-5 Orders": 0,
      "5+ Orders": 0,
    };

    customers.forEach((c) => {
      const count = c.totalOrders;
      if (count === 1) frequency["1 Order"]++;
      else if (count === 2) frequency["2 Orders"]++;
      else if (count <= 5) frequency["3-5 Orders"]++;
      else frequency["5+ Orders"]++;
    });

    return Object.entries(frequency).map(([name, count]) => ({
      name,
      count,
    }));
  }

  /**
   * Calculate top customers with CLV
   */
  static calculateTopCustomers(customers: Customer[], limit = 10) {
    return customers
      .map((c) => {
        const aov = c.totalOrders > 0 ? c.totalSpent / c.totalOrders : 0;
        // Basic CLV estimation: Total Spent * (1 + Retention probability placeholder)
        const estCLV = c.totalSpent * 1.5;

        return {
          id: c.customerId,
          name: c.name || c.email.split("@")[0],
          email: c.email,
          totalSpent: Math.round(c.totalSpent),
          orders: c.totalOrders,
          aov: Math.round(aov),
          estCLV: Math.round(estCLV),
          segment: c.segment || "regular",
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }
}

export default AnalyticsEngine;
