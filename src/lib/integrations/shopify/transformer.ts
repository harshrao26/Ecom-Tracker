/**
 * Shopify Data Transformer
 * Converts Shopify data format to our AnalyticsData format
 */

import { getCityTier, calculateGST } from "@/lib/utils/analytics";

export class ShopifyTransformer {
  /**
   * Transform Shopify order to our format
   */
  static transformOrder(shopifyOrder: any, storeId: string) {
    // Extract shipping address
    const shippingAddress = shopifyOrder.shipping_address || {};
    const city = shippingAddress.city || "Unknown";
    const state = shippingAddress.province || "Unknown";
    const pincode = shippingAddress.zip || "";

    // Calculate costs
    const platformFee = parseFloat(shopifyOrder.total_price) * 0.02; // Shopify ~2% fee
    const paymentGatewayFee = parseFloat(shopifyOrder.total_price) * 0.025; // ~2.5% gateway fee
    const shippingCost = parseFloat(
      shopifyOrder.total_shipping_price_set?.shop_money?.amount || "0",
    );
    const discount = parseFloat(shopifyOrder.total_discounts || "0");

    // Calculate GST (assuming 18% GST)
    const totalWithoutGST = parseFloat(shopifyOrder.total_price) / 1.18;
    const gst = calculateGST(totalWithoutGST, 18, "Delhi", state); // Assume seller in Delhi

    // Transform line items
    const items = shopifyOrder.line_items.map((item: any) => ({
      productId: item.product_id?.toString() || "",
      sku: item.sku || item.variant_id?.toString() || "",
      name: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
      cost: parseFloat(item.price) * 0.6, // Assume 40% margin (you'll need actual cost data)
      category: item.vendor || "General",
    }));

    return {
      orderId: `shopify_${shopifyOrder.id}`,
      platformOrderId: shopifyOrder.id.toString(),
      date: new Date(shopifyOrder.created_at),
      total: parseFloat(shopifyOrder.total_price),
      currency: shopifyOrder.currency || "INR",
      status: shopifyOrder.financial_status,
      paymentMethod:
        shopifyOrder.gateway === "cash_on_delivery" ? "cod" : "prepaid",
      customer: {
        id: shopifyOrder.customer?.id?.toString() || "guest",
        email: shopifyOrder.customer?.email || shopifyOrder.contact_email,
        name: shopifyOrder.customer?.first_name
          ? `${shopifyOrder.customer.first_name} ${shopifyOrder.customer.last_name}`
          : shippingAddress.name,
        city,
        state,
        pincode,
        tier: getCityTier(city),
      },
      items,
      costs: {
        platformFee,
        paymentGatewayFee,
        shippingCost,
        discount,
        gstAmount: gst.gstAmount,
        cgst: gst.cgst,
        sgst: gst.sgst,
        igst: gst.igst,
      },
    };
  }

  /**
   * Transform Shopify product to our format
   */
  static transformProduct(shopifyProduct: any) {
    // Get first variant for pricing
    const variant = shopifyProduct.variants?.[0] || {};

    return {
      productId: shopifyProduct.id.toString(),
      sku: variant.sku || shopifyProduct.id.toString(),
      name: shopifyProduct.title,
      category: shopifyProduct.product_type || "General",
      price: parseFloat(variant.price || "0"),
      cost: parseFloat(variant.price || "0") * 0.6, // Assume 40% margin
      stock: variant.inventory_quantity || 0,
      unitsSold: 0, // Will be calculated from orders
      revenue: 0, // Will be calculated from orders
    };
  }

  /**
   * Transform Shopify customer to our format
   */
  static transformCustomer(shopifyCustomer: any) {
    const address = shopifyCustomer.default_address || {};

    return {
      customerId: shopifyCustomer.id.toString(),
      email: shopifyCustomer.email,
      name: `${shopifyCustomer.first_name || ""} ${shopifyCustomer.last_name || ""}`.trim(),
      city: address.city || "Unknown",
      state: address.province || "Unknown",
      totalOrders: shopifyCustomer.orders_count || 0,
      totalSpent: parseFloat(shopifyCustomer.total_spent || "0"),
      firstOrderDate: new Date(shopifyCustomer.created_at),
      lastOrderDate: new Date(shopifyCustomer.updated_at),
    };
  }

  /**
   * Batch transform orders
   */
  static transformOrders(shopifyOrders: any[], storeId: string) {
    return shopifyOrders.map((order) => this.transformOrder(order, storeId));
  }

  /**
   * Batch transform products
   */
  static transformProducts(shopifyProducts: any[]) {
    return shopifyProducts.map((product) => this.transformProduct(product));
  }

  /**
   * Batch transform customers
   */
  static transformCustomers(shopifyCustomers: any[]) {
    return shopifyCustomers.map((customer) => this.transformCustomer(customer));
  }
}

export default ShopifyTransformer;
