/**
 * WooCommerce Data Transformer
 * Converts WooCommerce data format to our AnalyticsData format
 */

import { getCityTier, calculateGST } from "@/lib/utils/analytics";

export class WooCommerceTransformer {
  /**
   * Transform WooCommerce order to our format
   */
  static transformOrder(wooOrder: any, storeId: string) {
    // Extract shipping address
    const shipping = wooOrder.shipping || {};
    const billing = wooOrder.billing || {};
    const city = shipping.city || billing.city || "Unknown";
    const state = shipping.state || billing.state || "Unknown";
    const pincode = shipping.postcode || billing.postcode || "";

    // Detect payment method (COD or prepaid)
    const paymentMethod =
      wooOrder.payment_method === "cod" ||
      wooOrder.payment_method_title?.toLowerCase().includes("cash")
        ? "cod"
        : "prepaid";

    // Calculate costs
    const totalAmount = parseFloat(wooOrder.total || "0");
    const platformFee = totalAmount * 0.0; // WooCommerce doesn't charge platform fees
    const paymentGatewayFee =
      paymentMethod === "prepaid" ? totalAmount * 0.025 : 0; // 2.5% for online payments
    const shippingCost = parseFloat(wooOrder.shipping_total || "0");
    const discount = parseFloat(wooOrder.discount_total || "0");

    // Calculate GST (from tax)
    const taxTotal = parseFloat(wooOrder.total_tax || "0");
    const gst = calculateGST(totalAmount - taxTotal, 18, "Delhi", state);

    // Transform line items
    const items = wooOrder.line_items.map((item: any) => ({
      productId: item.product_id?.toString() || "",
      sku:
        item.sku ||
        item.variation_id?.toString() ||
        item.product_id?.toString() ||
        "",
      name: item.name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      cost: parseFloat(item.price) * 0.6, // Assume 40% margin
      category: item.categories?.[0]?.name || "General",
    }));

    // Extract customer info
    const customerEmail = billing.email || wooOrder.customer_user_email || "";
    const customerName =
      `${billing.first_name || ""} ${billing.last_name || ""}`.trim() ||
      `${shipping.first_name || ""} ${shipping.last_name || ""}`.trim() ||
      "Guest";

    return {
      orderId: `woo_${wooOrder.id}`,
      platformOrderId: wooOrder.id.toString(),
      date: new Date(wooOrder.date_created),
      total: totalAmount,
      currency: wooOrder.currency || "INR",
      status: wooOrder.status,
      paymentMethod,
      customer: {
        id: wooOrder.customer_id?.toString() || "guest",
        email: customerEmail,
        name: customerName,
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
        gstAmount: taxTotal,
        cgst: gst.cgst,
        sgst: gst.sgst,
        igst: gst.igst,
      },
    };
  }

  /**
   * Transform WooCommerce product to our format
   */
  static transformProduct(wooProduct: any) {
    return {
      productId: wooProduct.id.toString(),
      sku: wooProduct.sku || wooProduct.id.toString(),
      name: wooProduct.name,
      category: wooProduct.categories?.[0]?.name || "General",
      price: parseFloat(wooProduct.price || "0"),
      cost: parseFloat(wooProduct.price || "0") * 0.6, // Assume 40% margin
      stock: wooProduct.stock_quantity || 0,
      unitsSold: wooProduct.total_sales || 0,
      revenue: 0, // Will be calculated from orders
    };
  }

  /**
   * Transform WooCommerce customer to our format
   */
  static transformCustomer(wooCustomer: any) {
    const billing = wooCustomer.billing || {};

    return {
      customerId: wooCustomer.id.toString(),
      email: wooCustomer.email,
      name: `${wooCustomer.first_name || ""} ${wooCustomer.last_name || ""}`.trim(),
      city: billing.city || "Unknown",
      state: billing.state || "Unknown",
      totalOrders: wooCustomer.orders_count || 0,
      totalSpent: parseFloat(wooCustomer.total_spent || "0"),
      firstOrderDate: new Date(wooCustomer.date_created),
      lastOrderDate: new Date(
        wooCustomer.date_modified || wooCustomer.date_created,
      ),
    };
  }

  /**
   * Batch transform orders
   */
  static transformOrders(wooOrders: any[], storeId: string) {
    return wooOrders.map((order) => this.transformOrder(order, storeId));
  }

  /**
   * Batch transform products
   */
  static transformProducts(wooProducts: any[]) {
    return wooProducts.map((product) => this.transformProduct(product));
  }

  /**
   * Batch transform customers
   */
  static transformCustomers(wooCustomers: any[]) {
    return wooCustomers.map((customer) => this.transformCustomer(customer));
  }
}

export default WooCommerceTransformer;
