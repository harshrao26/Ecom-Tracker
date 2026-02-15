# 🚀 EcomInsights - Detailed Development Roadmap

Complete phase-by-phase implementation guide for building the e-commerce analytics SaaS platform.

---

## 📋 Project Overview

**Product Name:** EcomInsights  
**Tech Stack:** Next.js 15, TypeScript, MongoDB, Tailwind CSS, Google Gemini AI  
**Target:** Multi-platform e-commerce analytics with AI-powered insights  
**Pricing:** ₹2,999/month (Pro) - 5x cheaper than competitors

---

## Phase 1: Project Setup & Architecture ✅

### Goals
- Initialize Next.js project with TypeScript
- Set up database connection
- Create authentication system
- Configure development environment

### Files to Create

#### 1.1 Environment Configuration
**File:** `.env.example`
```
MONGODB_URI=mongodb://localhost:27017/ecom-insights
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_GEMINI_API_KEY=your-api-key
RAZORPAY_KEY_ID=your-razorpay-key
SHOPIFY_CLIENT_ID=your-shopify-id
```

#### 1.2 Database Connection
**File:** `lib/db/connection.ts`
- MongoDB connection with caching
- Singleton pattern for serverless
- Error handling and logging

#### 1.3 Database Models
**File:** `lib/db/models/User.ts` (90 lines)
```typescript
- Interface: IUser
- Fields: email, password, subscriptionTier, connectedStores, usage
- Subscription tiers: free, pro, enterprise
- Usage tracking: stores, API calls, retention days
```

**File:** `lib/db/models/Store.ts` (120 lines)
```typescript
- Interface: IStore
- Fields: platform, credentials, syncStatus, webhookUrl
- Platforms: shopify, woocommerce, custom
- OAuth credentials storage
- Sync scheduling
```

**File:** `lib/db/models/AnalyticsData.ts` (170 lines)
```typescript
- Interface: IAnalyticsData
- Time-series data storage
- Fields: date, storeId, revenue, orders, customers
- Product performance metrics
- Regional breakdown (city/state)
```

#### 1.4 Landing Pages
**File:** `app/page.tsx` (168 lines)
- Hero section with gradient background
- Features grid (6 cards)
- Pricing comparison
- CTA sections

**File:** `app/pricing/page.tsx` (180 lines)
- Three subscription tiers
- Feature comparison table
- Competitor pricing comparison
- Call-to-action buttons

**File:** `app/auth/signup/page.tsx` (141 lines)
- Name, email, password fields
- Company name (optional)
- Form validation
- API integration

**File:** `app/auth/login/page.tsx` (122 lines)
- Email and password login
- Forgot password link
- Redirect to dashboard

### Success Criteria
- ✅ Next.js dev server runs on `localhost:3000`
- ✅ MongoDB connection successful
- ✅ All pages accessible and styled
- ✅ Environment variables configured

---

## Phase 2: Core Analytics Engine

### Goals
- Build analytics calculation engine
- Implement data aggregation
- Create caching layer
- Develop API endpoints

### Files to Create

#### 2.1 Analytics Types
**File:** `lib/analytics/types.ts` (170 lines)
```typescript
// Core Interfaces
- Order interface (id, date, total, items, customer)
- Product interface (id, name, price, cost, category)
- Customer interface (id, name, location, lifetime_value)
- AnalyticsOverview interface (revenue, orders, AOV, profit)
- RegionalAnalytics interface (city, state, metrics)
- ProductPerformance interface (revenue, units, profit margin)
```

#### 2.2 Analytics Engine
**File:** `lib/analytics/engine.ts` (220 lines)
```typescript
class AnalyticsEngine {
  // Overview Metrics
  static calculateOverview(orders: Order[]): AnalyticsOverview
  
  // Profit Calculations  
  static calculateProfitMargin(orders: Order[]): number
  static calculateSKUProfitability(products: Product[]): ProfitData[]
  
  // Customer Analytics
  static calculateCLV(customers: Customer[]): number
  static segmentCustomers(customers: Customer[]): Segment[]
  
  // Time-Series
  static groupByPeriod(data: any[], period: 'day'|'week'|'month'): TimeSeriesData[]
  
  // Regional
  static analyzeByRegion(orders: Order[]): RegionalAnalytics[]
  
  // Product Performance
  static getTopProducts(products: Product[], limit: number): Product[]
  static analyzePriceRanges(products: Product[]): PriceRange[]
}
```

#### 2.3 Database Aggregator
**File:** `lib/analytics/aggregator.ts` (240 lines)
```typescript
class AnalyticsAggregator {
  // Fetch Methods
  static async getOverviewData(storeId, dateRange): Promise<Overview>
  static async getDailyTrends(storeId, days): Promise<TimeSeries[]>
  static async getTopProducts(storeId, limit): Promise<Product[]>
  static async getRegionalPerformance(storeId): Promise<Regional[]>
  
  // Growth Calculations
  static async calculateGrowthRate(storeId, period): Promise<number>
  static async comparePeriods(storeId, current, previous): Promise<Comparison>
}
```

#### 2.4 Caching Layer
**File:** `lib/analytics/cache.ts` (108 lines)
```typescript
class AnalyticsCache {
  private static cache = new Map();
  
  static set(key: string, value: any, ttl: number)
  static get(key: string): any | null
  static delete(key: string)
  static clear()
  static generateKey(storeId: string, params: any): string
}
```

#### 2.5 Sample Data Generator
**File:** `lib/analytics/sample-data.ts` (190 lines)
```typescript
// Generate realistic test data
function generateSampleOrders(count: number): Order[]
function generateSampleProducts(): Product[]
function generateSampleCustomers(count: number): Customer[]

// Indian cities data
const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', ...]
```

#### 2.6 API Endpoints
**File:** `app/api/analytics/overview/route.ts` (170 lines)
```typescript
export async function GET(request: Request) {
  // Parse query params: storeId, startDate, endDate
  // Check cache first
  // Fetch from database if cache miss
  // Aggregate data using AnalyticsAggregator
  // Calculate metrics using AnalyticsEngine
  // Cache result
  // Return JSON response
}
```

**File:** `app/api/analytics/seed/route.ts` (97 lines)
```typescript
export async function POST(request: Request) {
  // Generate sample data
  // Insert into database
  // Return success message
}

export async function DELETE(request: Request) {
  // Clear all analytics data
  // Clear cache
  // Return success message
}
```

### Success Criteria
- ✅ Analytics calculation functions working
- ✅ MongoDB aggregation queries optimized
- ✅ Cache reduces database calls by 80%
- ✅ API returns data in <200ms
- ✅ Sample data generator creates realistic patterns

---

## Phase 3: Platform Integrations

### Goals
- Shopify OAuth integration
- WooCommerce REST API integration
- Generic webhook system
- Data synchronization

### Files to Create

#### 3.1 Base Integration Interface
**File:** `lib/integrations/base.ts` (170 lines)
```typescript
interface IPlatformIntegration {
  // OAuth Methods
  getAuthUrl(shopUrl: string, state: string): string
  handleCallback(code: string, shop: string): Promise<Credentials>
  
  // Data Fetching
  fetchOrders(credentials: Credentials, dateRange: DateRange): Promise<Order[]>
  fetchProducts(credentials: Credentials): Promise<Product[]>
  fetchCustomers(credentials: Credentials): Promise<Customer[]>
  
  // Webhook Management
  registerWebhook(credentials: Credentials, url: string, topics: string[]): Promise<void>
  verifyWebhook(body: string, signature: string): boolean
  
  // Data Normalization
  normalizeOrder(rawOrder: any): NormalizedOrder
  normalizeProduct(rawProduct: any): NormalizedProduct
  normalizeCustomer(rawCustomer: any): NormalizedCustomer
}
```

#### 3.2 Shopify Integration
**File:** `lib/integrations/shopify.ts` (320 lines)
```typescript
class ShopifyIntegration implements IPlatformIntegration {
  private apiVersion = '2024-01';
  private scopes = 'read_orders,read_products,read_customers';
  
  // OAuth Flow
  getAuthUrl(shop: string, state: string): string {
    // Build Shopify install URL
    // Include scopes and redirect URI
  }
  
  async handleCallback(code: string, shop: string): Promise<Credentials> {
    // Exchange code for access token
    // Make POST to /admin/oauth/access_token
  }
  
  // Admin API Client
  async makeRequest(endpoint: string, credentials: Credentials) {
    // Add X-Shopify-Access-Token header
    // Handle rate limiting
    // Retry on errors
  }
  
  async fetchOrders(credentials: Credentials, dateRange: DateRange) {
    // GET /admin/api/2024-01/orders.json
    // Paginate through results
    // Normalize data
  }
  
  // Webhook Verification
  verifyWebhook(body: string, signature: string): boolean {
    // HMAC-SHA256 verification
    // Compare with X-Shopify-Hmac-Sha256 header
  }
}
```

#### 3.3 WooCommerce Integration
**File:** `lib/integrations/woocommerce.ts` (280 lines)
```typescript
class WooCommerceIntegration implements IPlatformIntegration {
  // REST API Authentication
  private generateAuth(consumerKey: string, consumerSecret: string): string {
    // Basic Auth with Consumer Key/Secret
  }
  
  async fetchOrders(credentials: Credentials, dateRange: DateRange) {
    // GET /wp-json/wc/v3/orders
    // Filter by date
    // Paginate with per_page and page params
  }
  
  async fetchProducts(credentials: Credentials) {
    // GET /wp-json/wc/v3/products
    // Include variations
  }
  
  // Webhook Support
  verifyWebhook(body: string, signature: string): boolean {
    // HMAC-SHA256 with webhook secret
  }
}
```

#### 3.4 Integration Factory
**File:** `lib/integrations/index.ts` (20 lines)
```typescript
export class IntegrationFactory {
  static create(platform: 'shopify' | 'woocommerce'): IPlatformIntegration {
    switch (platform) {
      case 'shopify':
        return new ShopifyIntegration();
      case 'woocommerce':
        return new WooCommerceIntegration();
      default:
        throw new Error('Unsupported platform');
    }
  }
}
```

#### 3.5 Store Connection API
**File:** `app/api/stores/connect/route.ts` (140 lines)
```typescript
export async function POST(request: Request) {
  // Parse platform and credentials
  // Validate credentials by test API call
  // Create Store document in database
  // Register webhooks
  // Perform initial sync
  // Return store ID
}

export async function GET(request: Request) {
  // Get user ID from session
  // Fetch all connected stores
  // Return stores list
}
```

#### 3.6 Data Sync API
**File:** `app/api/stores/sync/route.ts` (200 lines)
```typescript
export async function POST(request: Request) {
  // Get storeId from body
  // Fetch Store from database
  // Get integration instance
  // Fetch orders, products, customers
  // Process through AnalyticsEngine
  // Save to AnalyticsData collection
  // Update Store.lastSyncedAt
  // Clear relevant cache
  // Return sync summary
}
```

#### 3.7 Webhook Handlers
**File:** `app/api/webhooks/shopify/route.ts` (80 lines)
```typescript
export async function POST(request: Request) {
  // Verify webhook signature
  // Parse webhook topic (orders/create, orders/updated, etc.)
  // Find store by shop domain
  // Process webhook data
  // Update analytics in real-time
  // Return 200 OK
}
```

**File:** `app/api/webhooks/woocommerce/route.ts` (80 lines)
```typescript
export async function POST(request: Request) {
  // Verify webhook signature
  // Parse webhook event
  // Find store by webhook source
  // Process data
  // Update analytics
  // Return 200 OK
}
```

#### 3.8 OAuth Callback
**File:** `app/api/integrations/shopify/callback/route.ts` (50 lines)
```typescript
export async function GET(request: Request) {
  // Get code and shop from query params
  // Verify state parameter
  // Exchange code for access token
  // Save credentials to Store
  // Redirect to dashboard
}
```

### Success Criteria
- ✅ Shopify OAuth flow working
- ✅ WooCommerce API connection successful
- ✅ Webhooks verified and processed
- ✅ Data normalized to common format
- ✅ Initial sync completes in <30 seconds

---

## Phase 4: Analytics Dashboard

### Goals
- Build reusable chart components
- Create dashboard layout
- Implement data visualization
- Add filters and exports

### Files to Create

#### 4.1 Chart Components

**File:** `components/dashboard/MetricCard.tsx` (77 lines)
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export default function MetricCard({ title, value, change, icon, trend }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="gradient-icon">{icon}</div>
        <div className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
      <h3>{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

**File:** `components/dashboard/RevenueChart.tsx` (79 lines)
```typescript
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

**File:** `components/dashboard/OrderStatusChart.tsx` (85 lines)
```typescript
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function OrderStatusChart({ data }) {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
```

**File:** `components/dashboard/TopProductsChart.tsx` (92 lines)
```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProductsChart({ products }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={products} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip />
        <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

**File:** `components/dashboard/RegionalChart.tsx` (95 lines)
```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RegionalChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#14b8a6" radius={[8, 8, 0, 0]} />
        <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

#### 4.2 Main Dashboard
**File:** `app/dashboard/page.tsx` (350 lines)
```typescript
'use client';

import { useState, useEffect } from 'react';
import MetricCard from '@/components/dashboard/MetricCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
// ... other imports

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  
  useEffect(() => {
    fetchAnalytics();
  }, [period]);
  
  async function fetchAnalytics() {
    const res = await fetch(`/api/analytics/overview?period=${period}`);
    const data = await res.json();
    setAnalytics(data);
    setLoading(false);
  }
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="p-8">
      {/* Header with Period Selector */}
      <div className="flex justify-between mb-8">
        <h1>Analytics Dashboard</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.revenue.toLocaleString()}`}
          change={analytics.revenueGrowth}
          icon={<FiDollarSign />}
          trend={analytics.revenueGrowth > 0 ? 'up' : 'down'}
        />
        {/* ... more metric cards */}
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2>Revenue Trend</h2>
          <RevenueChart data={analytics.dailyRevenue} />
        </div>
        
        <div className="card">
          <h2>Order Status</h2>
          <OrderStatusChart data={analytics.orderStatus} />
        </div>
      </div>
      
      {/* Regional Analysis */}
      <div className="card mb-8">
        <h2>Regional Performance</h2>
        <RegionalChart data={analytics.regionalData} />
        
        {/* City-wise Table */}
        <table className="mt-6">
          <thead>
            <tr>
              <th>City</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>AOV</th>
            </tr>
          </thead>
          <tbody>
            {analytics.regionalData.map(city => (
              <tr key={city.name}>
                <td>{city.name}</td>
                <td>₹{city.revenue.toLocaleString()}</td>
                <td>{city.orders}</td>
                <td>₹{city.aov}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Top Products */}
      <div className="card">
        <h2>Top Selling Products</h2>
        <TopProductsChart products={analytics.topProducts} />
      </div>
    </div>
  );
}
```

### Success Criteria
- ✅ All charts render correctly
- ✅ Data updates when period changes
- ✅ Responsive design works on mobile
- ✅ Loading states handled
- ✅ Error messages displayed

---

## Phase 5: AI-Powered Insights

### Goals
- Integrate Google Gemini API
- Build recommendation engine
- Implement forecasting
- Create profit optimization

### Files to Create

**File:** `lib/ai/gemini-client.ts` (120 lines)
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiClient {
  private model;
  
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  
  async generateInsight(prompt: string, data: any): Promise<string> {
    const context = JSON.stringify(data, null, 2);
    const fullPrompt = `${prompt}\n\nData:\n${context}`;
    
    const result = await this.model.generateContent(fullPrompt);
    return result.response.text();
  }
}
```

**File:** `lib/ai/insights-generator.ts` (250 lines)
```typescript
class InsightsGenerator {
  private gemini: GeminiClient;
  
  async generateSalesForecast(historicalData: TimeSeries[]): Promise<Forecast> {
    const prompt = `Analyze this sales data and provide:
    1. 30-day revenue forecast
    2. Expected growth rate
    3. Seasonal patterns identified
    4. Confidence level (%)
    
    Provide response in JSON format.`;
    
    const response = await this.gemini.generateInsight(prompt, historicalData);
    return JSON.parse(response);
  }
  
  async suggestProfitOptimization(products: Product[]): Promise<Recommendations> {
    const prompt = `Analyze these products and suggest:
    1. Which products to increase price (with new price)
    2. Which products to discount (with discount %)
    3. Products to discontinue (low margin)
    4. Bundle opportunities
    
    Provide actionable recommendations in JSON.`;
    
    const response = await this.gemini.generateInsight(prompt, products);
    return JSON.parse(response);
  }
  
  async predictChurn(customers: Customer[]): Promise<ChurnPrediction> {
    const prompt = `Identify customers at risk of churning:
    1. High-risk customers (list with risk score)
    2. Churn indicators found
    3. Suggested retention actions
    4. Expected revenue impact
    
    JSON format.`;
    
    const response = await this.gemini.generateInsight(prompt, customers);
    return JSON.parse(response);
  }
  
  async generateMarketingStrategy(analytics: AnalyticsData): Promise<Strategy> {
    const prompt = `Based on this analytics data, suggest:
    1. Target customer segments
    2. Best-performing marketing channels
    3. Recommended campaigns
    4. Budget allocation advice
    5. Expected ROI
    
    Provide detailed strategy in JSON.`;
    
    const response = await this.gemini.generateInsight(prompt, analytics);
    return JSON.parse(response);
  }
}
```

**File:** `app/api/ai/insights/route.ts` (180 lines)
```typescript
export async function POST(request: Request) {
  const { storeId, insightType } = await request.json();
  
  // Fetch relevant data based on insight type
  const data = await fetchDataForInsight(storeId, insightType);
  
  // Generate insight using AI
  const generator = new InsightsGenerator();
  let insight;
  
  switch (insightType) {
    case 'forecast':
      insight = await generator.generateSalesForecast(data);
      break;
    case 'profit':
      insight = await generator.suggestProfitOptimization(data);
      break;
    case 'churn':
      insight = await generator.predictChurn(data);
      break;
    case 'marketing':
      insight = await generator.generateMarketingStrategy(data);
      break;
  }
  
  // Cache the insight
  AnalyticsCache.set(`insight:${storeId}:${insightType}`, insight, 86400); // 24 hours
  
  return Response.json(insight);
}
```

**File:** `app/dashboard/insights/page.tsx` (280 lines)
```typescript
'use client';

export default function InsightsPage() {
  const [insights, setInsights] = useState({});
  const [generating, setGenerating] = useState({});
  
  async function generateInsight(type: string) {
    setGenerating({ ...generating, [type]: true });
    
    const res = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId, insightType: type })
    });
    
    const insight = await res.json();
    setInsights({ ...insights, [type]: insight });
    setGenerating({ ...generating, [type]: false });
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">AI-Powered Insights</h1>
      
      {/* Sales Forecast */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Forecast</h2>
          <button onClick={() => generateInsight('forecast')}>
            {generating.forecast ? 'Generating...' : 'Generate Forecast'}
          </button>
        </div>
        
        {insights.forecast && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <MetricCard
                title="30-Day Revenue Forecast"
                value={`₹${insights.forecast.predictedRevenue}`}
                change={insights.forecast.growthRate}
              />
              <MetricCard
                title="Confidence Level"
                value={`${insights.forecast.confidence}%`}
              />
            </div>
            
            <div className="mt-4">
              <h3>Seasonal Patterns:</h3>
              <ul>
                {insights.forecast.patterns.map(pattern => (
                  <li key={pattern}>{pattern}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Profit Optimization */}
      <div className="card mb-6">
        <h2>Profit Optimization Suggestions</h2>
        {/* Similar structure */}
      </div>
      
      {/* Churn Prediction */}
      <div className="card mb-6">
        <h2>Customer Churn Prediction</h2>
        {/* Similar structure */}
      </div>
      
      {/* Marketing Strategy */}
      <div className="card">
        <h2>Marketing Strategy Recommendations</h2>
        {/* Similar structure */}
      </div>
    </div>
  );
}
```

### Success Criteria
- ✅ Gemini API integration working
- ✅ Insights generated in <10 seconds
- ✅ Recommendations are actionable
- ✅ JSON responses parsed correctly
- ✅ Insights cached for 24 hours

---

## Phase 6: User Management & Subscription

### Goals
- Implement NextAuth.js
- Create subscription management
- Integrate payment gateway
- Handle usage limits

### Files to Create

**File:** `app/api/auth/[...nextauth]/route.ts` (150 lines)
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/lib/db/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found');
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid password');
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          subscriptionTier: user.subscriptionTier
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subscriptionTier = user.subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.subscriptionTier = token.subscriptionTier;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
```

**File:** `app/api/subscription/upgrade/route.ts` (200 lines)
```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: Request) {
  const { userId, plan } = await request.json();
  
  // Get plan pricing
  const pricing = {
    pro: 299900, // ₹2,999 in paisa
    enterprise: 799900 // ₹7,999 in paisa
  };
  
  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: pricing[plan],
    currency: 'INR',
    receipt: `sub_${userId}_${Date.now()}`
  });
  
  return Response.json({ orderId: order.id });
}

export async function PUT(request: Request) {
  // Verify payment signature
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
  
  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  
  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Update user subscription
  await User.findByIdAndUpdate(userId, {
    subscriptionTier: plan,
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    'usage.dataRetentionDays': plan === 'pro' ? 365 : 999999
  });
  
  return Response.json({ success: true });
}
```

**File:** `lib/middleware/usage-limits.ts` (100 lines)
```typescript
export async function checkUsageLimits(userId: string, action: string) {
  const user = await User.findById(userId);
  
  const limits = {
    free: { stores: 1, apiCalls: 1000 },
    pro: { stores: 3, apiCalls: 10000 },
    enterprise: { stores: 999, apiCalls: 999999 }
  };
  
  const userLimits = limits[user.subscriptionTier];
  
  switch (action) {
    case 'connect_store':
      if (user.usage.storesConnected >= userLimits.stores) {
        throw new Error('Store limit reached. Please upgrade.');
      }
      break;
    
    case 'api_call':
      if (user.usage.apiCallsThisMonth >= userLimits.apiCalls) {
        throw new Error('API limit reached. Please upgrade.');
      }
      await User.findByIdAndUpdate(userId, {
        $inc: { 'usage.apiCallsThisMonth': 1 }
      });
      break;
  }
  
  return true;
}
```

**File:** `app/dashboard/subscription/page.tsx` (220 lines)
```typescript
'use client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  async function handleUpgrade(plan: string) {
    setLoading(true);
    
    // Create order
    const res = await fetch('/api/subscription/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id, plan })
    });
    
    const { orderId } = await res.json();
    
    // Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: plan === 'pro' ? 299900 : 799900,
      currency: 'INR',
      name: 'EcomInsights',
      description: `${plan.toUpperCase()} Subscription`,
      order_id: orderId,
      handler: async function (response: any) {
        // Verify payment
        await fetch('/api/subscription/upgrade', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(response)
        });
        
        alert('Subscription upgraded successfully!');
        window.location.reload();
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  }
  
  return (
    <div className="p-8">
      <h1>Manage Subscription</h1>
      
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Free Tier */}
        <div className="card">
          <h2>Free</h2>
          <p className="text-3xl font-bold">₹0/month</p>
          <ul className="mt-4">
            <li>✓ 1 Store</li>
            <li>✓ Basic Analytics</li>
            <li>✓ 30-day Data Retention</li>
          </ul>
          {session.user.subscriptionTier === 'free' && (
            <button disabled>Current Plan</button>
          )}
        </div>
        
        {/* Pro Tier */}
        <div className="card border-2 border-blue-500">
          <div className="badge">POPULAR</div>
          <h2>Pro</h2>
          <p className="text-3xl font-bold">₹2,999/month</p>
          <ul className="mt-4">
            <li>✓ 3 Stores</li>
            <li>✓ AI Insights</li>
            <li>✓ 1-year Data Retention</li>
            <li>✓ Priority Support</li>
          </ul>
          {session.user.subscriptionTier !== 'pro' && (
            <button onClick={() => handleUpgrade('pro')}>
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
        
        {/* Enterprise Tier */}
        <div className="card">
          <h2>Enterprise</h2>
          <p className="text-3xl font-bold">₹7,999/month</p>
          <ul className="mt-4">
            <li>✓ Unlimited Stores</li>
            <li>✓ API Access</li>
            <li>✓ Unlimited Retention</li>
            <li>✓ Custom Features</li>
            <li>✓ Dedicated Support</li>
          </ul>
          {session.user.subscriptionTier !== 'enterprise' && (
            <button onClick={() => handleUpgrade('enterprise')}>
              Upgrade to Enterprise
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Success Criteria
- ✅ User registration working
- ✅ Login/logout functional
- ✅ Razorpay payment successful
- ✅ Subscription limits enforced
- ✅ Session management secure

---

## Phase 7: Advanced Features

### Goals
- Export reports (PDF/CSV)
- Alert system
- WhatsApp notifications
- Team collaboration

### Files to Create

**File:** `lib/exports/pdf-generator.ts` (180 lines)
```typescript
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function generatePDFReport(analytics: AnalyticsData) {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('EcomInsights Analytics Report', 20, 20);
  
  // Add summary metrics
  doc.setFontSize(12);
  doc.text(`Period: ${analytics.startDate} to ${analytics.endDate}`, 20, 35);
  doc.text(`Total Revenue: ₹${analytics.totalRevenue.toLocaleString()}`, 20, 45);
  
  // Add table
  doc.autoTable({
    startY: 60,
    head: [['Metric', 'Value', 'Change']],
    body: [
      ['Revenue', `₹${analytics.revenue}`, `${analytics.revenueGrowth}%`],
      ['Orders', analytics.orders, `${analytics.ordersGrowth}%`],
      ['AOV', `₹${analytics.aov}`, `${analytics.aovGrowth}%`]
    ]
  });
  
  // Save PDF
  doc.save('analytics-report.pdf');
}
```

**File:** `lib/exports/csv-generator.ts` (100 lines)
```typescript
export function generateCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}
```

**File:** `lib/alerts/alert-engine.ts` (150 lines)
```typescript
interface AlertRule {
  type: 'revenue_drop' | 'inventory_low' | 'churn_risk';
  threshold: number;
  notifyVia: ('email' | 'whatsapp')[];
}

class AlertEngine {
  async checkAlerts(storeId: string) {
    const analytics = await AnalyticsAggregator.getOverviewData(storeId);
    const rules = await this.getAlertRules(storeId);
    
    for (const rule of rules) {
      const triggered = this.evaluateRule(rule, analytics);
      
      if (triggered) {
        await this.sendAlert(rule, analytics);
      }
    }
  }
  
  private evaluateRule(rule: AlertRule, analytics: any): boolean {
    switch (rule.type) {
      case 'revenue_drop':
        return analytics.revenueGrowth < -rule.threshold;
      case 'inventory_low':
        return analytics.lowStockProducts.length > rule.threshold;
      case 'churn_risk':
        return analytics.churnRisk > rule.threshold;
    }
  }
  
  private async sendAlert(rule: AlertRule, analytics: any) {
    if (rule.notifyVia.includes('email')) {
      await this.sendEmail(rule, analytics);
    }
    if (rule.notifyVia.includes('whatsapp')) {
      await this.sendWhatsApp(rule, analytics);
    }
  }
}
```

**File:** `lib/notifications/whatsapp.ts` (120 lines)
```typescript
export async function sendWhatsAppAlert(phone: string, message: string) {
  // Using WhatsApp Business API
  const res = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: { body: message }
    })
  });
  
  return res.json();
}
```

**File:** `app/dashboard/alerts/page.tsx` (200 lines)
```typescript
export default function AlertsPage() {
  const [rules, setRules] = useState([]);
  
  async function createAlert(ruleData: AlertRule) {
    await fetch('/api/alerts/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData)
    });
    
    fetchRules();
  }
  
  return (
    <div className="p-8">
      <h1>Alert Configuration</h1>
      
      <div className="card mt-6">
        <h2>Create New Alert</h2>
        <form onSubmit={handleSubmit}>
          <select name="type">
            <option value="revenue_drop">Revenue Drop</option>
            <option value="inventory_low">Low Inventory</option>
            <option value="churn_risk">Churn Risk</option>
          </select>
          
          <input type="number" name="threshold" placeholder="Threshold" />
          
          <div>
            <label>
              <input type="checkbox" name="email" />
              Email Notification
            </label>
            <label>
              <input type="checkbox" name="whatsapp" />
              WhatsApp Notification
            </label>
          </div>
          
          <button type="submit">Create Alert</button>
        </form>
      </div>
      
      <div className="mt-8">
        <h2>Active Alerts</h2>
        {rules.map(rule => (
          <div key={rule.id} className="card">
            <h3>{rule.type}</h3>
            <p>Threshold: {rule.threshold}</p>
            <p>Notify via: {rule.notifyVia.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Success Criteria
- ✅ PDF reports generate correctly
- ✅ CSV exports working
- ✅ Alerts trigger based on rules
- ✅ WhatsApp notifications sent
- ✅ Email notifications sent

---

## Phase 8: Testing & Deployment

### Goals
- Write unit tests
- Integration testing
- Performance optimization
- Production deployment

### Files to Create

**File:** `__tests__/analytics/engine.test.ts` (200 lines)
```typescript
import { AnalyticsEngine } from '@/lib/analytics/engine';

describe('AnalyticsEngine', () => {
  describe('calculateOverview', () => {
    it('should calculate correct total revenue', () => {
      const orders = [
        { total: 1000, items: [] },
        { total: 2000, items: [] }
      ];
      
      const result = AnalyticsEngine.calculateOverview(orders);
      expect(result.totalRevenue).toBe(3000);
    });
    
    it('should calculate correct AOV', () => {
      const orders = [
        { total: 1000, items: [] },
        { total: 2000, items: [] }
      ];
      
      const result = AnalyticsEngine.calculateOverview(orders);
      expect(result.aov).toBe(1500);
    });
  });
  
  describe('calculateProfitMargin', () => {
    it('should calculate correct margin percentage', () => {
      const orders = [
        { total: 1000, cost: 600 }
      ];
      
      const margin = AnalyticsEngine.calculateProfitMargin(orders);
      expect(margin).toBe(40); // 40% margin
    });
  });
});
```

**File:** `__tests__/api/analytics.test.ts` (150 lines)
```typescript
import { GET } from '@/app/api/analytics/overview/route';

describe('/api/analytics/overview', () => {
  it('should return 200 with valid store ID', async () => {
    const request = new Request('http://localhost:3000/api/analytics/overview?storeId=123');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('revenue');
  });
  
  it('should return 400 without store ID', async () => {
    const request = new Request('http://localhost:3000/api/analytics/overview');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
  });
});
```

**File:** `lib/performance/optimizations.ts` (100 lines)
```typescript
// Database query optimization
export async function optimizeQueries() {
  // Add indexes
  await AnalyticsData.collection.createIndex({ storeId: 1, date: -1 });
  await AnalyticsData.collection.createIndex({ storeId: 1, 'regionalData.city': 1 });
  
  // Aggregate in database instead of memory
  // Use $project to limit fields
  // Use $match early in pipeline
}

// Image optimization
export const imageConfig = {
  formats: ['image/webp'],
  deviceSizes: [640, 750, 828, 1080],
  imageSizes: [16, 32, 48, 64, 96],
};

// Code splitting
// Use dynamic imports for heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
});
```

**File:** `vercel.json` (30 lines)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "GOOGLE_GEMINI_API_KEY": "@gemini_key"
  }
}
```

### Deployment Steps

1. **Environment Setup**
```bash
# Create .env.production
MONGODB_URI=<production-mongo-uri>
NEXTAUTH_URL=https://ecominsights.com
NEXTAUTH_SECRET=<generated-secret>
```

2. **Build and Test**
```bash
npm run build
npm run test
npm run lint
```

3. **Deploy to Vercel**
```bash
vercel --prod
```

4. **Post-Deployment**
- Set up MongoDB Atlas production cluster
- Configure Razorpay webhook URLs
- Set up Shopify app in production
- Enable WhatsApp Business API

### Success Criteria
- ✅ All tests passing
- ✅ Build completes without errors
- ✅ Lighthouse score > 90
- ✅ API response time < 500ms
- ✅ Database queries optimized
- ✅ Production environment stable

---

## 📊 Project Statistics

### Total Files: ~60 files
### Total Lines of Code: ~6,200+ lines

**Breakdown by Category:**
- Database Models: 400 lines
- Analytics Engine: 720 lines
- Platform Integrations: 900 lines
- API Routes: 1,200 lines
- UI Components: 1,800 lines
- AI Integration: 450 lines
- Testing: 400 lines
- Utilities: 330 lines

---

## 🎯 Success Metrics

### Technical Metrics
- ✅ Test coverage > 80%
- ✅ Page load time < 2 seconds
- ✅ API response time < 500ms
- ✅ Database queries < 100ms
- ✅ Uptime > 99.9%

### Business Metrics
- 🎯 User signup goal: 100 in first month
- 🎯 Conversion to paid: 10%
- 🎯 Monthly revenue: ₹30,000
- 🎯 Customer satisfaction: 4.5/5

---

## 🚦 Next Steps After Completion

1. **Marketing Launch**
   - Create demo videos
   - Write blog posts
   - LinkedIn outreach to e-commerce sellers

2. **Feature Enhancements**
   - Mobile app (React Native)
   - Chrome extension for quick insights
   - Slack integration

3. **Scale Infrastructure**
   - Add Redis for caching
   - Set up CDN for static assets
   - Implement queue for background jobs

4. **Customer Support**
   - Set up Intercom chat
   - Create help documentation
   - Video tutorials

---

**Happy Coding! 🚀**
