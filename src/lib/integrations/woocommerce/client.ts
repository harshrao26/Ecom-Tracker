/**
 * WooCommerce API Client
 * Handles all WooCommerce REST API interactions
 */

import crypto from "crypto";

export class WooCommerceClient {
  private siteUrl: string;
  private consumerKey: string;
  private consumerSecret: string;
  private apiVersion: string;

  constructor(
    siteUrl: string,
    consumerKey: string,
    consumerSecret: string,
    apiVersion: string = "wc/v3",
  ) {
    this.siteUrl = siteUrl.replace(/\/$/, ""); // Remove trailing slash
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.apiVersion = apiVersion;
  }

  /**
   * Build API URL with authentication
   */
  private buildUrl(endpoint: string, params: Record<string, any> = {}): string {
    const url = new URL(
      `${this.siteUrl}/wp-json/${this.apiVersion}/${endpoint}`,
    );

    // Add query parameters
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key].toString());
    });

    // Add authentication (consumer key and secret in query string)
    url.searchParams.append("consumer_key", this.consumerKey);
    url.searchParams.append("consumer_secret", this.consumerSecret);

    return url.toString();
  }

  /**
   * Make API request
   */
  private async request(
    endpoint: string,
    method: string = "GET",
    params: Record<string, any> = {},
    body?: any,
  ) {
    const url = this.buildUrl(endpoint, params);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WooCommerce API error: ${error}`);
    }

    return response.json();
  }

  /**
   * Validate API credentials
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.request("system_status");
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fetch orders
   */
  async fetchOrders(
    params: {
      page?: number;
      perPage?: number;
      after?: string;
      before?: string;
      status?: string;
    } = {},
  ): Promise<any[]> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.perPage || 100,
    };

    if (params.after) queryParams.after = params.after;
    if (params.before) queryParams.before = params.before;
    if (params.status) queryParams.status = params.status;

    return this.request("orders", "GET", queryParams);
  }

  /**
   * Fetch products
   */
  async fetchProducts(
    params: {
      page?: number;
      perPage?: number;
    } = {},
  ): Promise<any[]> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.perPage || 100,
    };

    return this.request("products", "GET", queryParams);
  }

  /**
   * Fetch customers
   */
  async fetchCustomers(
    params: {
      page?: number;
      perPage?: number;
    } = {},
  ): Promise<any[]> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      per_page: params.perPage || 100,
    };

    return this.request("customers", "GET", queryParams);
  }

  /**
   * Fetch single order
   */
  async fetchOrder(orderId: string): Promise<any> {
    return this.request(`orders/${orderId}`);
  }

  /**
   * Fetch single product
   */
  async fetchProduct(productId: string): Promise<any> {
    return this.request(`products/${productId}`);
  }

  /**
   * Get system status (for testing connection)
   */
  async getSystemStatus(): Promise<any> {
    return this.request("system_status");
  }

  /**
   * Get store settings
   */
  async getSettings(): Promise<any> {
    return this.request("settings/general");
  }
}

export default WooCommerceClient;
