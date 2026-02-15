import mongoose, { Schema, model, models, Document } from "mongoose";

// Order item interface
interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
  category?: string;
}

// Customer info interface
interface CustomerInfo {
  id: string;
  email?: string;
  name?: string;
  city: string;
  state: string;
  pincode: string;
  tier: "metro" | "tier1" | "tier2" | "tier3";
}

// Cost breakdown interface
interface CostBreakdown {
  platformFee: number;
  paymentGatewayFee: number;
  shippingCost: number;
  discount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
}

// Order interface
interface Order {
  orderId: string;
  platformOrderId: string;
  date: Date;
  total: number;
  currency: string;
  status: string;
  paymentMethod: "prepaid" | "cod";
  customer: CustomerInfo;
  items: OrderItem[];
  costs: CostBreakdown;
}

// Product interface
interface Product {
  productId: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  unitsSold: number;
  revenue: number;
}

// Customer interface
interface Customer {
  customerId: string;
  email: string;
  name?: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  segment?: "vip" | "regular" | "at-risk" | "churned";
}

export interface IAnalyticsData extends Document {
  _id: string;
  storeId: string;
  date: Date;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsDataSchema = new Schema<IAnalyticsData>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    orders: [
      {
        orderId: { type: String, required: true },
        platformOrderId: { type: String, required: true },
        date: { type: Date, required: true },
        total: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        status: { type: String, required: true },
        paymentMethod: {
          type: String,
          enum: ["prepaid", "cod"],
          required: true,
        },
        customer: {
          id: { type: String, required: true },
          email: String,
          name: String,
          city: { type: String, required: true },
          state: { type: String, required: true },
          pincode: { type: String, required: true },
          tier: {
            type: String,
            enum: ["metro", "tier1", "tier2", "tier3"],
            default: "tier2",
          },
        },
        items: [
          {
            productId: { type: String, required: true },
            sku: { type: String, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            cost: { type: Number, required: true },
            category: String,
          },
        ],
        costs: {
          platformFee: { type: Number, default: 0 },
          paymentGatewayFee: { type: Number, default: 0 },
          shippingCost: { type: Number, default: 0 },
          discount: { type: Number, default: 0 },
          gstAmount: { type: Number, default: 0 },
          cgst: { type: Number, default: 0 },
          sgst: { type: Number, default: 0 },
          igst: { type: Number, default: 0 },
        },
      },
    ],
    products: [
      {
        productId: { type: String, required: true },
        sku: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        cost: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        unitsSold: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 },
      },
    ],
    customers: [
      {
        customerId: { type: String, required: true },
        email: { type: String, required: true },
        name: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        totalOrders: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        firstOrderDate: { type: Date, required: true },
        lastOrderDate: { type: Date, required: true },
        segment: {
          type: String,
          enum: ["vip", "regular", "at-risk", "churned"],
          default: "regular",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient querying
AnalyticsDataSchema.index({ storeId: 1, date: -1 });
AnalyticsDataSchema.index({ "orders.date": 1 });
AnalyticsDataSchema.index({ "orders.status": 1 });
AnalyticsDataSchema.index({ "orders.customer.state": 1 });
AnalyticsDataSchema.index({ "orders.customer.tier": 1 });
AnalyticsDataSchema.index({ "orders.paymentMethod": 1 });
AnalyticsDataSchema.index({ "products.category": 1 });
AnalyticsDataSchema.index({ "customers.segment": 1 });

// Method to calculate total revenue for the day
AnalyticsDataSchema.methods.calculateDailyRevenue = function () {
  return this.orders.reduce(
    (sum: number, order: Order) => sum + order.total,
    0,
  );
};

// Method to calculate total profit for the day
AnalyticsDataSchema.methods.calculateDailyProfit = function () {
  return this.orders.reduce((sum: number, order: Order) => {
    const orderProfit = order.items.reduce(
      (itemSum: number, item: OrderItem) => {
        return itemSum + (item.price - item.cost) * item.quantity;
      },
      0,
    );

    // Deduct all costs
    return (
      sum +
      orderProfit -
      order.costs.platformFee -
      order.costs.paymentGatewayFee -
      order.costs.shippingCost
    );
  }, 0);
};

// Method to get COD statistics
AnalyticsDataSchema.methods.getCODStats = function () {
  const codOrders = this.orders.filter((o: Order) => o.paymentMethod === "cod");
  const prepaidOrders = this.orders.filter(
    (o: Order) => o.paymentMethod === "prepaid",
  );

  return {
    codCount: codOrders.length,
    prepaidCount: prepaidOrders.length,
    codRevenue: codOrders.reduce((sum: number, o: Order) => sum + o.total, 0),
    prepaidRevenue: prepaidOrders.reduce(
      (sum: number, o: Order) => sum + o.total,
      0,
    ),
    codPercentage: (codOrders.length / this.orders.length) * 100,
  };
};

const AnalyticsData =
  models.AnalyticsData ||
  model<IAnalyticsData>("AnalyticsData", AnalyticsDataSchema);

export default AnalyticsData;
