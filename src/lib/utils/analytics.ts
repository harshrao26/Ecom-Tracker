/**
 * Utility functions for analytics
 */

/**
 * Calculate date range based on period
 */
export function calculateDateRange(period: string) {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "90d":
      start.setDate(start.getDate() - 90);
      break;
    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case "mtd": // Month to date
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "ytd": // Year to date
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }

  return {
    start: start.toISOString().split("T")[0], // "2024-01-10"
    end: end.toISOString().split("T")[0], // "2024-01-17"
  };
}

/**
 * Format currency in INR
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR",
): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

/**
 * Format large numbers (45000 -> 45K)
 */
export function formatNumber(num: number): string {
  if (num >= 10000000) {
    // 1 Crore
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    // 1 Lakh
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num}`;
}

/**
 * Get city tier based on city name
 */
export function getCityTier(
  city: string,
): "metro" | "tier1" | "tier2" | "tier3" {
  const metroCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Hyderabad",
  ];
  const tier1Cities = [
    "Pune",
    "Ahmedabad",
    "Surat",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
  ];

  if (metroCities.includes(city)) return "metro";
  if (tier1Cities.includes(city)) return "tier1";

  // You can extend this with proper tier2 city list
  // For now, assume tier2 for other known cities
  return "tier2";
}

/**
 * Calculate GST breakdown based on state
 */
export function calculateGST(
  amount: number,
  gstRate: number,
  fromState: string,
  toState: string,
) {
  const gstAmount = (amount * gstRate) / (100 + gstRate);

  // If same state -> CGST + SGST
  // If different state -> IGST
  if (fromState === toState) {
    return {
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0,
    };
  } else {
    return {
      gstAmount,
      cgst: 0,
      sgst: 0,
      igst: gstAmount,
    };
  }
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validate GST number
 */
export function isValidGSTNumber(gst: string): boolean {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
}

/**
 * Get period display name
 */
export function getPeriodDisplayName(period: string): string {
  const names: Record<string, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
    today: "Today",
    yesterday: "Yesterday",
    mtd: "Month to Date",
    ytd: "Year to Date",
  };
  return names[period] || period;
}

/**
 * Generate date array for charts
 */
export function generateDateArray(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
