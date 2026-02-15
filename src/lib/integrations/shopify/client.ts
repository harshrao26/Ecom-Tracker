/**
 * Shopify API Client
 * Handles all Shopify API interactions
 */

import crypto from "crypto";
import { encrypt } from "@/lib/db/models/Store";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || "";
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || "";
const SHOPIFY_SCOPES =
  process.env.SHOPIFY_SCOPES || "read_orders,read_products,read_customers";
const SHOPIFY_REDIRECT_URI = process.env.SHOPIFY_REDIRECT_URI || "";
const SHOPIFY_API_VERSION = "2024-01";

export class ShopifyClient {
  /**
   * Generate OAuth authorization URL
   */
  static generateAuthUrl(shop: string, state: string): string {
    const scopes = SHOPIFY_SCOPES;
    const redirectUri = SHOPIFY_REDIRECT_URI;

    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

    return authUrl;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(
    shop: string,
    code: string,
  ): Promise<string> {
    const url = `https://${shop}/admin/oauth/access_token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhook(data: string, hmacHeader: string): boolean {
    const hash = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET)
      .update(data, "utf8")
      .digest("base64");

    return hash === hmacHeader;
  }

  /**
   * Fetch orders from Shopify
   */
  static async fetchOrders(
    shop: string,
    accessToken: string,
    params: {
      limit?: number;
      sinceId?: string;
      createdAtMin?: string;
      createdAtMax?: string;
      status?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sinceId) queryParams.set("since_id", params.sinceId);
    if (params.createdAtMin)
      queryParams.set("created_at_min", params.createdAtMin);
    if (params.createdAtMax)
      queryParams.set("created_at_max", params.createdAtMax);
    if (params.status) queryParams.set("status", params.status);

    const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch orders: ${error}`);
    }

    const data = await response.json();
    return data.orders;
  }

  /**
   * Fetch products from Shopify
   */
  static async fetchProducts(
    shop: string,
    accessToken: string,
    params: {
      limit?: number;
      sinceId?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sinceId) queryParams.set("since_id", params.sinceId);

    const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products.json?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch products: ${error}`);
    }

    const data = await response.json();
    return data.products;
  }

  /**
   * Fetch customers from Shopify
   */
  static async fetchCustomers(
    shop: string,
    accessToken: string,
    params: {
      limit?: number;
      sinceId?: string;
    } = {},
  ) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.sinceId) queryParams.set("since_id", params.sinceId);

    const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/customers.json?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch customers: ${error}`);
    }

    const data = await response.json();
    return data.customers;
  }

  /**
   * Register webhook
   */
  static async registerWebhook(
    shop: string,
    accessToken: string,
    topic: string,
    address: string,
  ) {
    const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/webhooks.json`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: "json",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to register webhook: ${error}`);
    }

    const data = await response.json();
    return data.webhook;
  }

  /**
   * Get shop info
   */
  static async getShopInfo(shop: string, accessToken: string) {
    const url = `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch shop info: ${error}`);
    }

    const data = await response.json();
    return data.shop;
  }
}

export default ShopifyClient;
