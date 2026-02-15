import { GeminiAIClient } from "./gemini-client";

// Define insight types
export interface SalesForecast {
  predictedRevenue: number;
  growthRate: number;
  confidence: number;
  peakDays: string[];
  seasonalPatterns: string[];
  dailyForecast: Array<{ date: string; predicted: number }>;
}

export interface ProfitOptimization {
  increasePrice: Array<{
    productId: string;
    productName: string;
    currentPrice: number;
    suggestedPrice: number;
    reason: string;
    expectedImpact: string;
  }>;
  discount: Array<{
    productId: string;
    productName: string;
    currentPrice: number;
    suggestedDiscount: number;
    reason: string;
    expectedImpact: string;
  }>;
  discontinue: Array<{
    productId: string;
    productName: string;
    reason: string;
    replacementSuggestion?: string;
  }>;
  bundles: Array<{
    products: string[];
    bundleName: string;
    individualTotal: number;
    bundlePrice: number;
    expectedSales: number;
    profitIncrease: string;
  }>;
}

export interface ChurnPrediction {
  highRiskCustomers: Array<{
    customerId: string;
    name: string;
    lastPurchase: string;
    daysSinceLastPurchase: number;
    lifetimeValue: number;
    churnRisk: number;
    indicators: string[];
    retentionAction: string;
  }>;
  mediumRiskCustomers: any[];
  revenueAtRisk: number;
  retentionROI: {
    investment: number;
    expectedRetention: string;
    expectedRevenue: number;
    netGain: number;
  };
}

export interface MarketingStrategy {
  targetSegments: Array<{
    segment: string;
    size: number;
    avgSpend: number;
    channel: string;
    messaging: string;
  }>;
  campaigns: Array<{
    name: string;
    target: string;
    channel: string;
    budget: number;
    expectedRevenue: number;
    roi: string;
    timing: string;
  }>;
  budgetAllocation: Array<{
    channel: string;
    budget: number;
    expectedReturn: number;
  }>;
}

export class InsightsGenerator {
  private aiClient: GeminiAIClient;

  constructor() {
    this.aiClient = new GeminiAIClient();
  }

  /**
   * PREDICTION 1: Sales Forecasting
   */
  async generateSalesForecast(historicalData: {
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
    period: number;
  }): Promise<SalesForecast> {
    console.log("📈 Generating sales forecast...");

    const prompt = `
Analyze this e-commerce sales data and provide a detailed 30-day revenue forecast.

ANALYSIS REQUIREMENTS:
1. Calculate predicted revenue for next 30 days
2. Identify growth rate percentage
3. Detect seasonal patterns (weekends, month-end, holidays)
4. Provide confidence level (0-100%)
5. List daily predictions for next 30 days

DATA POINTS:
- ${historicalData.period} days of historical data
- Total revenue in period: ₹${this.sumRevenue(historicalData.dailyRevenue)}
- Average daily revenue: ₹${this.avgRevenue(historicalData.dailyRevenue)}

RESPONSE FORMAT (JSON):
{
  "predictedRevenue": <number>,
  "growthRate": <number>,
  "confidence": <number 0-100>,
  "peakDays": ["day1", "day2"],
  "seasonalPatterns": ["pattern1", "pattern2"],
  "dailyForecast": [
    { "date": "YYYY-MM-DD", "predicted": <number> }
  ]
}
`;

    const forecast = await this.aiClient.generateInsight(
      prompt,
      historicalData.dailyRevenue,
      { requireJSON: true },
    );

    this.validateForecast(forecast);
    return forecast as SalesForecast;
  }

  /**
   * PREDICTION 2: Profit Optimization
   */
  async suggestProfitOptimization(
    products: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      cost: number;
      unitsSold: number;
      revenue: number;
      margin: number;
    }>,
  ): Promise<ProfitOptimization> {
    console.log("💰 Generating profit optimization suggestions...");

    const prompt = `
Analyze these products and suggest profit optimization strategies for Indian e-commerce.

CONTEXT:
- Total products: ${products.length}
- Average margin: ${this.avgMargin(products).toFixed(2)}%

ANALYSIS REQUIREMENTS:
1. Identify products where price can be increased (high demand, low price sensitivity)
2. Suggest products to discount (slow movers, overstocked)
3. Recommend products to discontinue (negative margin, obsolete)
4. Propose product bundles (complementary items)

RESPONSE FORMAT (JSON):
{
  "increasePrice": [
    {
      "productId": "...",
      "productName": "...",
      "currentPrice": <number>,
      "suggestedPrice": <number>,
      "reason": "...",
      "expectedImpact": "..."
    }
  ],
  "discount": [...],
  "discontinue": [...],
  "bundles": [
    {
      "products": ["id1", "id2"],
      "bundleName": "...",
      "individualTotal": <number>,
      "bundlePrice": <number>,
      "expectedSales": <number>,
      "profitIncrease": "..."
    }
  ]
}
`;

    const optimization = await this.aiClient.generateInsight(prompt, products, {
      requireJSON: true,
    });

    return optimization as ProfitOptimization;
  }

  /**
   * PREDICTION 3: Customer Churn Prediction
   */
  async predictChurn(
    customers: Array<{
      id: string;
      name: string;
      email: string;
      lastPurchase: Date;
      lifetimeValue: number;
      orderCount: number;
      avgOrderValue: number;
      city: string;
    }>,
  ): Promise<ChurnPrediction> {
    console.log("👥 Predicting customer churn...");

    const customersWithDays = customers.map((c) => ({
      ...c,
      daysSinceLastPurchase: this.daysSince(c.lastPurchase),
    }));

    const prompt = `
Analyze these customers and predict churn risk for an Indian e-commerce store.

CHURN INDICATORS:
- Days since last purchase vs typical purchase frequency
- Declining order frequency
- Decreasing average order value
- Customer lifetime value (LTV)

RESPONSE FORMAT (JSON):
{
  "highRiskCustomers": [
    {
      "customerId": "...",
      "name": "...",
      "lastPurchase": "...",
      "daysSinceLastPurchase": <number>,
      "lifetimeValue": <number>,
      "churnRisk": <number 0-100>,
      "indicators": ["reason1", "reason2"],
      "retentionAction": "..."
    }
  ],
  "mediumRiskCustomers": [...],
  "revenueAtRisk": <number>,
  "retentionROI": {
    "investment": <number>,
    "expectedRetention": "...",
    "expectedRevenue": <number>,
    "netGain": <number>
  }
}
`;

    const churnPrediction = await this.aiClient.generateInsight(
      prompt,
      customersWithDays,
      { requireJSON: true },
    );

    return churnPrediction as ChurnPrediction;
  }

  /**
   * PREDICTION 4: Marketing Strategy
   */
  async generateMarketingStrategy(analytics: {
    customerSegments: any;
    regionalData: any[];
    topProducts: any[];
    codAnalysis: any;
  }): Promise<MarketingStrategy> {
    console.log("📢 Generating marketing strategy...");

    const prompt = `
Create a comprehensive marketing strategy based on this analytics data for the Indian market.

INDIAN MARKET CONTEXT:
- Focus on tier 1, 2 cities
- Regional preferences
- Festival seasons
- Payment preferences (COD, UPI)

STRATEGY REQUIREMENTS:
1. Target customer segments
2. Best performing marketing channels
3. Specific campaign ideas with timing
4. Budget allocation recommendations
5. Expected ROI

RESPONSE FORMAT (JSON):
{
  "targetSegments": [
    {
      "segment": "...",
      "size": <number>,
      "avgSpend": <number>,
      "channel": "...",
      "messaging": "..."
    }
  ],
  "campaigns": [
    {
      "name": "...",
      "target": "...",
      "channel": "...",
      "budget": <number>,
      "expectedRevenue": <number>,
      "roi": "...",
      "timing": "..."
    }
  ],
  "budgetAllocation": [
    {
      "channel": "...",
      "budget": <number>,
      "expectedReturn": <number>
    }
  ]
}
`;

    const strategy = await this.aiClient.generateInsight(prompt, analytics, {
      requireJSON: true,
      systemInstruction:
        "You are an expert in Indian e-commerce marketing with deep understanding of local consumer behavior.",
    });

    return strategy as MarketingStrategy;
  }

  // HELPER FUNCTIONS
  private sumRevenue(data: any[]): number {
    return data.reduce((sum, d) => sum + d.revenue, 0);
  }

  private avgRevenue(data: any[]): number {
    return data.length > 0 ? this.sumRevenue(data) / data.length : 0;
  }

  private avgMargin(products: any[]): number {
    const total = products.reduce((sum, p) => sum + (p.margin || 0), 0);
    return products.length > 0 ? total / products.length : 0;
  }

  private daysSince(date: Date): number {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private validateForecast(forecast: any): void {
    if (!forecast.predictedRevenue || forecast.predictedRevenue < 0) {
      throw new Error("Invalid forecast: predictedRevenue missing or negative");
    }
    if (forecast.confidence < 0 || forecast.confidence > 100) {
      throw new Error("Invalid forecast: confidence must be 0-100");
    }
  }
}

export const insightsGenerator = new InsightsGenerator();
