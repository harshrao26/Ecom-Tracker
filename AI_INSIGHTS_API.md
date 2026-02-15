# AI Insights API - Usage Examples

## API Endpoint

`POST /api/ai/insights`

## Request Body

```json
{
  "userId": "USER_ID",
  "storeId": "STORE_ID",  // optional, default: "all"
  "period": "30d",         // optional, default: "30d"
  "insightType": "all"     // optional, default: "all"
}
```

## Available Insight Types

### 1. Sales Forecast (`forecast`)
30-day revenue prediction with growth factors

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "period": "30d",
    "insightType": "forecast"
  }'
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "salesForecast": "Aapke business ka analysis:\n\n📈 30-Day Revenue Forecast:\n- Conservative: ₹2,80,000 - ₹3,20,000\n- Optimistic: ₹3,50,000 - ₹4,00,000\n\nKey factors:\n1. Current growth rate 15% hai, agar yeh maintain ho toh next month mein 3.5L+ possible hai\n2. Top products (XYZ, ABC) consistently perform kar rahe hain\n3. Festival season approach kar raha hai, so demand increase hoga\n\nAction items:\n✅ Stock up karo top products ki\n✅ Marketing spend badhao 20%\n✅ COD option improve karo tier 2/3 cities mein\n..."
  },
  "period": "30d",
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

### 2. Inventory Optimization (`inventory`)
Stock alerts, restocking priorities, overstock clearance

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "insightType": "inventory"
  }'
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "inventoryOptimization": "📦 Inventory Analysis:\n\n🚨 URGENT - Restocking Needed:\n1. Product A: Sirf 10 units bacha hai, last month 50 bik gaye\n2. Product B: 5 units left, daily 2-3 orders aa rahe hain\n3. Product C: Stock khatam hone wala hai\n\n💰 Overstock Clearance:\n- Product X: 500 units pade hain, sirf 20 bik rahe monthly\n- Product Y: High stock, low demand\n\nRecommendations:\n✅ Product A & B urgent restock karo (2 din mein)\n✅ Product X par 20-30% discount offer karo\n✅ Bundle deals banao slow-moving items ke liye\n..."
  }
}
```

### 3. Pricing Optimization (`pricing`)
Price increase opportunities, discount strategies

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "insightType": "pricing"
  }'
```

### 4. Churn Prediction (`churn`)
At-risk customers, retention strategies

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "insightType": "churn"
  }'
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "churnPrediction": "👥 Customer Retention Analysis:\n\n⚠️ At-Risk Customers: 45\nYeh customers 60+ days se order nahi kiye hain.\n\nWin-Back Strategy:\n1. WhatsApp message bhejo: 'Hello! Aapko miss kar rahe hain. Aapke liye special 15% discount hai. Code: WELCOME-BACK'\n2. Email personalized offers with their favorite products\n3. Free shipping offer de do first order par\n\n💎 VIP Retention:\n- 12 VIP customers hain (₹50k+ spent)\n- Unko exclusive early access do new products ki\n- Personal thank you call karo top 5 ko\n...\n"
  }
}
```

### 5. Performance Report (`report`)
Comprehensive weekly/monthly summary

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "period": "30d",
    "insightType": "report"
  }'
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "performanceReport": "📊 Monthly Performance Report\n\n🎯 Key Highlights:\n✅ Revenue: ₹2,45,000 (15% growth!)\n✅ Orders: 680 (12% increase)\n✅ Profit: ₹73,500 (30% margin)\n✅ Mumbai aur Delhi markets strong hain\n\n📈 What's Working:\n- Top 3 products 60% revenue generate kar rahe\n- Prepaid orders badh rahe hain (good sign!)\n- Repeat customers increase ho rahe\n\n⚠️ Areas of Concern:\n- COD orders zyada hain (75%)\n- Tier 2/3 cities mein low penetration\n- Inventory management improve karna padega\n\n💡 Action Items:\n1. COD ko reduce karo - prepaid discounts offer karo\n2. Tier 2 cities target karo marketing mein\n3. Top products ka stock maintain rakho\n4. WhatsApp automation set up karo\n\n🎁 Growth Opportunities:\n- Festival season aa raha - inventory ready rakho\n- Social media marketing shuru karo\n- Email campaigns bhejo at-risk customers ko\n..."
  }
}
```

### 6. India-Specific Insights (`india`)
COD optimization, regional expansion, tier 2/3 cities

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "insightType": "india"
  }'
```

### 7. All Insights (`all`)
Generate all insights at once

**Example:**
```bash
curl -X POST http://localhost:3000/api/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "period": "30d",
    "insightType": "all"
  }'
```

---

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "insights": {
    "salesForecast": "...",
    "inventoryOptimization": "...",
    "pricingOptimization": "...",
    "churnPrediction": "...",
    "performanceReport": "...",
    "indiaInsights": "..."
  },
  "period": "30d",
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Error Responses

### Missing API Key
```json
{
  "error": "Failed to generate insights",
  "message": "GEMINI_API_KEY not found in environment variables"
}
```

### Invalid User ID
```json
{
  "error": "userId is required"
}
```

---

## Rate Limiting

- Gemini API has rate limits
- Cache AI insights for at least 1 hour
- Don't regenerate insights too frequently
- Consider implementing a cooldown period

---

## Frontend Integration Example

```typescript
// React component
const [insights, setInsights] = useState(null);
const [loading, setLoading] = useState(false);

async function generateInsights() {
  setLoading(true);
  
  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: session.user.id,
      period: '30d',
      insightType: 'all'
    })
  });
  
  const data = await response.json();
  setInsights(data.insights);
  setLoading(false);
}

// Display
<div className="insights">
  <h2>🤖 AI Insights</h2>
  
  {insights?.performanceReport && (
    <div className="report">
      <h3>Performance Report</h3>
      <ReactMarkdown>{insights.performanceReport}</ReactMarkdown>
    </div>
  )}
  
  {insights?.salesForecast && (
    <div className="forecast">
      <h3>Sales Forecast</h3>
      <ReactMarkdown>{insights.salesForecast}</ReactMarkdown>
    </div>
  )}
</div>
```

---

## Best Practices

1. **Cache Insights**: Store in database/Redis for 1-6 hours
2. **Progressive Loading**: Generate insights on-demand, not all at once
3. **User Controls**: Let users choose which insights to generate
4. **Language Toggle**: Support English/Hindi/Hinglish based on user preference
5. **Feedback Loop**: Allow users to rate insights quality

---

## Hinglish Output Features

All AI responses are in **Hinglish** (mix of Hindi and English):
- Uses conversational tone
- Addresses user as "aap"
- Mix of Hindi and English words
- Easy to understand for Indian sellers
- Uses emojis for visual appeal
- Actionable recommendations in local context

Example:
> "Aapke business ka growth bahut accha hai! 15% increase last month se. Mumbai aur Delhi markets strong perform kar rahe hain. COD orders thode zyada hain (75%), isliye prepaid ko encourage karne ke liye discount offer karo."
