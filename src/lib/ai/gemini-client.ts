/**
 * Gemini AI Client
 * Handles interactions with Google Gemini 2.0 for structured analytics insights
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export class GeminiAIClient {
  private model: GenerativeModel;
  private apiKey: string;

  constructor() {
    // STEP 1: GET API KEY FROM ENVIRONMENT
    this.apiKey = process.env.GEMINI_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    // STEP 2: INITIALIZE GEMINI AI
    const genAI = new GoogleGenerativeAI(this.apiKey);

    // STEP 3: SELECT MODEL
    // Using gemini-2.0-flash-thinking-exp-1219 for advanced reasoning
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash-thinking-exp-1219",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    console.log("✅ Gemini AI initialized successfully");
  }

  /**
   * Generate AI insight with structured prompt
   */
  async generateInsight(
    prompt: string,
    data: any,
    options?: {
      requireJSON?: boolean;
      systemInstruction?: string;
    },
  ): Promise<any> {
    try {
      // STEP 1: PREPARE DATA CONTEXT
      const dataContext = this.prepareDataContext(data);

      // STEP 2: BUILD COMPLETE PROMPT
      const fullPrompt = this.buildPrompt(prompt, dataContext, options);

      // STEP 3: MAKE API CALL
      console.log("🤖 Calling Gemini API...");
      const startTime = Date.now();

      const result = await this.model.generateContent(fullPrompt);

      const endTime = Date.now();
      console.log(`✅ Gemini response received in ${endTime - startTime}ms`);

      // STEP 4: EXTRACT RESPONSE TEXT
      const response = result.response;
      const text = response.text();

      // STEP 5: PARSE JSON IF REQUIRED
      if (options?.requireJSON) {
        return JSON.parse(this.extractJSON(text));
      }

      return text;
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      throw new Error(
        `AI Generation Failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Prepare data context (convert objects to readable format)
   */
  private prepareDataContext(data: any): string {
    if (typeof data === "string") {
      return data;
    }

    // Convert to formatted JSON with indentation
    return JSON.stringify(data, null, 2);
  }

  /**
   * Build complete prompt with instructions
   */
  private buildPrompt(
    userPrompt: string,
    dataContext: string,
    options?: { requireJSON?: boolean; systemInstruction?: string },
  ): string {
    let prompt = "";

    // SYSTEM INSTRUCTION
    if (options?.systemInstruction) {
      prompt += `${options.systemInstruction}\n\n`;
    }

    // DEFAULT INSTRUCTIONS
    prompt += `You are an expert e-commerce analytics AI assistant specializing in Indian markets.\n`;
    prompt += `Your role is to analyze data and provide actionable, data-driven insights.\n\n`;

    // JSON REQUIREMENT
    if (options?.requireJSON) {
      prompt += `CRITICAL: Your response MUST be valid JSON only. No markdown, no explanations, just pure JSON.\n\n`;
    }

    // USER PROMPT
    prompt += `${userPrompt}\n\n`;

    // DATA CONTEXT
    prompt += `=== DATA ===\n${dataContext}\n\n`;

    // JSON REMINDER
    if (options?.requireJSON) {
      prompt += `Remember: Return ONLY valid JSON. Start with { and end with }.`;
    }

    return prompt;
  }

  /**
   * Extract JSON from response (handles markdown code blocks)
   */
  private extractJSON(text: string): string {
    // Remove markdown code blocks if present
    let cleaned = text.trim();

    // Remove ```json and ```
    cleaned = cleaned.replace(/```json\s*/g, "");
    cleaned = cleaned.replace(/```\s*/g, "");

    // Find first { and last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON found in response");
    }

    const jsonStr = cleaned.substring(firstBrace, lastBrace + 1);

    // Validate JSON
    try {
      JSON.parse(jsonStr);
      return jsonStr;
    } catch (e) {
      throw new Error("Invalid JSON in response");
    }
  }

  /**
   * Get token count estimate
   */
  async estimateTokens(text: string): Promise<number> {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  // --- LEGACY METHODS (Kept for compatibility during migration) ---

  async generateSalesForecast(data: any): Promise<string> {
    return this.generateInsight(
      "Analyze this data and provide 30-day sales forecast in Hinglish.",
      data,
    );
  }

  async generateInventoryInsights(data: any): Promise<string> {
    return this.generateInsight(
      "Analyze inventory data and give recommendations in Hinglish.",
      data,
    );
  }

  async generatePricingInsights(data: any): Promise<string> {
    return this.generateInsight(
      "Analyze pricing data and suggest optimizations in Hinglish.",
      data,
    );
  }

  async generateChurnPrediction(data: any): Promise<string> {
    return this.generateInsight(
      "Analyze customer data and provide churn prevention strategies in Hinglish.",
      data,
    );
  }

  async generatePerformanceReport(data: any): Promise<string> {
    return this.generateInsight(
      "Create a business performance report in Hinglish.",
      data,
    );
  }

  async generateIndiaSpecificInsights(data: any): Promise<string> {
    return this.generateInsight(
      "Provide India-specific e-commerce insights in Hinglish.",
      data,
    );
  }
}

export default GeminiAIClient;
