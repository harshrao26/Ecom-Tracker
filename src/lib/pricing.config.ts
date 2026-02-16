export const PRICING_PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    amount_in_paise: 0,
    features: [
      "1 Platform Sync (Shopify/Woo)",
      "100 Orders per month",
      "1-Day Data Retention",
      "Basic Sales Reports",
      "Email Support",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 999,
    amount_in_paise: 99900,
    features: [
      "2 Platform Sync (Shopify/Woo)",
      "1,000 Orders per month",
      "30-Day Data Retention",
      "Basic Sales Reports",
      "Email Support",
    ],
  },
  growth: {
    id: "growth",
    name: "Growth",
    price: 2499,
    amount_in_paise: 249900,
    features: [
      "Unlimited Shopify/Woo Stores",
      "10,000 Orders per month",
      "90-Day Data History",
      "Full AI Predictive Engine",
      "WhatsApp Profit Alerts",
      "GST-Ready Reporting",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 9999,
    amount_in_paise: 999900,
    features: [
      "Amazon & Flipkart Integration",
      "Unlimited Orders & Data",
      "Custom AI Strategy Hub",
      "API & Webhook Access",
      "Dedicated Account Manager",
      "White-label Reports",
    ],
  },
};

export type PlanId = keyof typeof PRICING_PLANS;
