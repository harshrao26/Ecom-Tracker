/**
 * Razorpay Client
 * Handles Razorpay API interactions
 */

import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export class RazorpayClient {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  /**
   * Create subscription
   */
  async createSubscription(params: {
    planId: string;
    customerId?: string;
    totalCount?: number;
    quantity?: number;
  }) {
    return this.razorpay.subscriptions.create({
      plan_id: params.planId,
      customer_id: params.customerId,
      total_count: params.totalCount || 12, // 12 months default
      quantity: params.quantity || 1,
      customer_notify: 1,
    });
  }

  /**
   * Create customer
   */
  async createCustomer(params: {
    name: string;
    email: string;
    contact: string;
  }) {
    return this.razorpay.customers.create({
      name: params.name,
      email: params.email,
      contact: params.contact,
    });
  }

  /**
   * Create order (for one-time payments)
   */
  async createOrder(params: { amount: number; currency?: string }) {
    return this.razorpay.orders.create({
      amount: params.amount * 100, // Convert to paise
      currency: params.currency || "INR",
      receipt: `order_${Date.now()}`,
    });
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const text = params.orderId + "|" + params.paymentId;
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generated_signature === params.signature;
  }

  /**
   * Verify subscription signature
   */
  verifySubscriptionSignature(params: {
    subscriptionId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    const text = params.subscriptionId + "|" + params.paymentId;
    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generated_signature === params.signature;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string) {
    return this.razorpay.subscriptions.cancel(subscriptionId);
  }

  /**
   * Fetch subscription
   */
  async fetchSubscription(subscriptionId: string) {
    return this.razorpay.subscriptions.fetch(subscriptionId);
  }

  /**
   * Fetch payment
   */
  async fetchPayment(paymentId: string) {
    return this.razorpay.payments.fetch(paymentId);
  }

  /**
   * Create plan
   */
  async createPlan(params: {
    period: "daily" | "weekly" | "monthly" | "yearly";
    interval: number;
    amount: number;
    currency?: string;
    name: string;
    description?: string;
  }) {
    return this.razorpay.plans.create({
      period: params.period,
      interval: params.interval,
      item: {
        name: params.name,
        description: params.description || "",
        amount: params.amount * 100, // Convert to paise
        currency: params.currency || "INR",
      },
    });
  }
}

export default RazorpayClient;
