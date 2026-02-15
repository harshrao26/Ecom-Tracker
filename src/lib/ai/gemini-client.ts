/**
 * Gemini AI Client
 * Handles interactions with Google Gemini API for analytics insights
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-pro";

export class GeminiAIClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
  }

  /**
   * Generate sales forecast
   */
  async generateSalesForecast(data: {
    historicalRevenue: number[];
    currentRevenue: number;
    growthRate: number;
    topProducts: any[];
    seasonalTrends?: any;
  }): Promise<string> {
    const prompt = `
You are an expert e-commerce analyst. Analyze this data and provide sales forecast in Hinglish (mix of Hindi and English).

**Historical Data:**
- Last 30 days revenue: ₹${data.currentRevenue.toLocaleString("en-IN")}
- Growth rate: ${data.growthRate}%
- Top products: ${data.topProducts.map((p) => `${p.name} (₹${p.revenue})`).join(", ")}

**Task:** Provide a 30-day sales forecast with:
1. Expected revenue range (conservative to optimistic)
2. Key factors affecting forecast
3. Seasonal considerations
4. Action items to maximize revenue

Reply in Hinglish, conversational tone. Use "aap" for addressing. Be concise but actionable.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Generate inventory optimization recommendations
   */
  async generateInventoryInsights(data: {
    products: Array<{
      name: string;
      stock: number;
      unitsSold: number;
      revenue: number;
    }>;
    totalRevenue: number;
  }): Promise<string> {
    const lowStock = data.products.filter((p) => p.stock < p.unitsSold * 0.5);
    const overstock = data.products.filter((p) => p.stock > p.unitsSold * 3);
    const fastMoving = data.products
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const prompt = `
You are an inventory management expert for e-commerce. Analyze this inventory data and give recommendations in Hinglish.

**Current Inventory Status:**
- Total products: ${data.products.length}
- Low stock items: ${lowStock.length}
- Overstock items: ${overstock.length}
- Fast-moving products: ${fastMoving.map((p) => `${p.name} (${p.unitsSold} units)`).join(", ")}

**Low Stock Alert:**
${lowStock
  .slice(0, 5)
  .map((p) => `- ${p.name}: Only ${p.stock} units left, ${p.unitsSold} sold`)
  .join("\n")}

**Overstock Alert:**
${overstock
  .slice(0, 5)
  .map(
    (p) => `- ${p.name}: ${p.stock} units in stock, only ${p.unitsSold} sold`,
  )
  .join("\n")}

**Task:** Provide:
1. Restocking priorities (urgent items)
2. Overstock clearance strategies
3. Optimal stock levels for top products
4. Cost impact estimate

Reply in Hinglish. Be specific with numbers and actionable steps.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Generate pricing optimization suggestions
   */
  async generatePricingInsights(data: {
    products: Array<{
      name: string;
      price: number;
      cost: number;
      profitMargin: number;
      revenue: number;
      competitors?: number;
    }>;
    avgMargin: number;
  }): Promise<string> {
    const lowMargin = data.products.filter((p) => p.profitMargin < 20);
    const highValue = data.products
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const prompt = `
You are a pricing strategist for Indian e-commerce. Analyze pricing data and suggest optimizations in Hinglish.

**Current Pricing Status:**
- Average profit margin: ${data.avgMargin}%
- Low-margin products: ${lowMargin.length}
- High-revenue products: ${highValue.map((p) => `${p.name} (margin: ${p.profitMargin}%)`).join(", ")}

**Products Needing Price Review:**
${lowMargin
  .slice(0, 5)
  .map(
    (p) =>
      `- ${p.name}: Price ₹${p.price}, Cost ₹${p.cost}, Margin ${p.profitMargin}%`,
  )
  .join("\n")}

**Task:** Suggest:
1. Price increase opportunities (with justification)
2. Discount strategies for slow-moving items
3. Bundle pricing ideas
4. Competitive positioning tips
5. Expected profit impact

Reply in Hinglish, practical advice for Indian market.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Predict customer churn and retention strategies
   */
  async generateChurnPrediction(data: {
    customerSegments: {
      vip: number;
      regular: number;
      atRisk: number;
      churned: number;
    };
    vipCustomers: any[];
    atRiskCustomers: any[];
  }): Promise<string> {
    const prompt = `
You are a customer retention expert for e-commerce. Analyze customer data and provide churn prevention strategies in Hinglish.

**Customer Segments:**
- VIP customers: ${data.customerSegments.vip} (high value)
- Regular customers: ${data.customerSegments.regular} (active)
- At-risk customers: ${data.customerSegments.atRisk} (haven't ordered in 60+ days)
- Churned customers: ${data.customerSegments.churned} (inactive 180+ days)

**At-Risk Customers:**
${data.atRiskCustomers
  .slice(0, 5)
  .map(
    (c) =>
      `- Customer spent ₹${c.totalSpent}, ${c.daysSinceLastOrder} days since last order`,
  )
  .join("\n")}

**VIP Customers (to retain):**
${data.vipCustomers
  .slice(0, 3)
  .map((c) => `- ${c.totalOrders} orders, ₹${c.totalSpent} spent`)
  .join("\n")}

**Task:** Recommend:
1. Win-back campaigns for at-risk customers
2. VIP retention strategies
3. Personalized offers
4. WhatsApp/Email messaging templates
5. Expected recovery rate

Reply in Hinglish, actionable retention tactics for Indian customers.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Generate comprehensive weekly/monthly report
   */
  async generatePerformanceReport(data: {
    overview: any;
    topProducts: any[];
    regionalData: any[];
    customerSegments: any;
    codAnalysis: any;
    period: string;
  }): Promise<string> {
    const prompt = `
You are a business analyst creating a performance report for an Indian e-commerce seller. Write in Hinglish.

**Period:** ${data.period}

**Overview:**
- Revenue: ₹${data.overview.totalRevenue?.toLocaleString("en-IN")}
- Orders: ${data.overview.totalOrders}
- Profit: ₹${data.overview.totalProfit?.toLocaleString("en-IN")} (${data.overview.profitMargin}% margin)
- Growth: ${data.overview.revenueGrowth}% vs last period

**Top Cities:**
${data.regionalData
  .slice(0, 3)
  .map((r) => `- ${r.city}: ₹${r.revenue.toLocaleString("en-IN")}`)
  .join("\n")}

**Top Products:**
${data.topProducts
  .slice(0, 3)
  .map((p) => `- ${p.name}: ₹${p.revenue.toLocaleString("en-IN")}`)
  .join("\n")}

**Payment Methods:**
- COD: ${data.codAnalysis.codPercentage}%
- Prepaid: ${100 - data.codAnalysis.codPercentage}%

**Task:** Create a summary report with:
1. 🎯 Key Highlights (3-4 points)
2. 📈 What's Working Well
3. ⚠️ Areas of Concern
4. 💡 Action Items (priority wise)
5. 🎁 Growth Opportunities

Use emojis, Hinglish, conversational tone. Make it easy to read and actionable.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Generate India-specific insights
   */
  async generateIndiaSpecificInsights(data: {
    codAnalysis: any;
    regionalData: any[];
    gstData?: any;
  }): Promise<string> {
    const prompt = `
You are an expert on Indian e-commerce market. Analyze this India-specific data and provide insights in Hinglish.

**COD Analysis:**
- COD orders: ${data.codAnalysis.codPercentage}%
- COD revenue: ₹${data.codAnalysis.codRevenue?.toLocaleString("en-IN")}

**Top Cities:**
${data.regionalData
  .slice(0, 5)
  .map((r) => `- ${r.city}, ${r.state}: ₹${r.revenue.toLocaleString("en-IN")}`)
  .join("\n")}

**Task:** Provide:
1. COD optimization tips (reduce COD %, improve prepaid)
2. Regional expansion suggestions
3. Tier 2/3 city growth strategies
4. Festival season planning
5. India-specific payment trends

Reply in Hinglish, practical for Indian sellers.
`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

export default GeminiAIClient;
