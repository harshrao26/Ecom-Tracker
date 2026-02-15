/**
 * Language Context
 * Provides language switching functionality across the app
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "english" | "hindi" | "hinglish";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  english: {
    // Header
    "header.title": "Analytics Dashboard",
    "header.subtitle": "Complete business overview",

    // KPIs
    "kpi.revenue": "Total Revenue",
    "kpi.orders": "Total Orders",
    "kpi.profit": "Profit",
    "kpi.aov": "Avg Order Value",
    "kpi.margin": "margin",

    // Charts
    "chart.revenue": "Revenue Trend",
    "chart.products": "Top Products",
    "chart.cities": "Top Cities",
    "chart.customers": "Customer Segments",

    // COD
    "cod.title": "COD vs Prepaid Analysis",
    "cod.cash": "Cash on Delivery",
    "cod.prepaid": "Prepaid/Online",
    "cod.orders": "orders",
    "cod.warning": "High COD ratio",
    "cod.tip": "Try offering prepaid discounts to reduce COD percentage!",

    // AI
    "ai.title": "AI Insights",
    "ai.generate": "Generate Insights",
    "ai.generating": "Generating...",
    "ai.empty.title":
      'Click "Generate Insights" to get AI-powered recommendations',
    "ai.empty.subtitle":
      "Sales forecast, inventory tips, pricing strategies, and more!",

    // Tabs
    "tab.report": "Performance Report",
    "tab.forecast": "Sales Forecast",
    "tab.inventory": "Inventory",
    "tab.pricing": "Pricing",
    "tab.churn": "Churn",
    "tab.india": "India Insights",

    // Period
    "period.7d": "Last 7 Days",
    "period.30d": "Last 30 Days",
    "period.90d": "Last 90 Days",
    "period.ytd": "Year to Date",

    // Store
    "store.all": "All Stores",
    "store.loading": "Loading stores...",

    // Common
    "common.loading": "Loading analytics...",
    "common.error": "Error Loading Data",
    "common.retry": "Retry",
    "common.noData": "No data available",
  },

  hindi: {
    // Header
    "header.title": "एनालिटिक्स डैशबोर्ड",
    "header.subtitle": "आपके व्यवसाय का पूर्ण विवरण",

    // KPIs
    "kpi.revenue": "कुल राजस्व",
    "kpi.orders": "कुल ऑर्डर",
    "kpi.profit": "लाभ",
    "kpi.aov": "औसत ऑर्डर मूल्य",
    "kpi.margin": "मार्जिन",

    // Charts
    "chart.revenue": "राजस्व रुझान",
    "chart.products": "शीर्ष उत्पाद",
    "chart.cities": "शीर्ष शहर",
    "chart.customers": "ग्राहक विभाजन",

    // COD
    "cod.title": "COD बनाम प्रीपेड विश्लेषण",
    "cod.cash": "डिलीवरी पर नकद",
    "cod.prepaid": "प्रीपेड/ऑनलाइन",
    "cod.orders": "ऑर्डर",
    "cod.warning": "उच्च COD अनुपात",
    "cod.tip": "COD प्रतिशत कम करने के लिए प्रीपेड छूट देने का प्रयास करें!",

    // AI
    "ai.title": "AI इनसाइट्स",
    "ai.generate": "इनसाइट्स जनरेट करें",
    "ai.generating": "जनरेट हो रहा है...",
    "ai.empty.title":
      'AI-संचालित सिफारिशें प्राप्त करने के लिए "इनसाइट्स जनरेट करें" पर क्लिक करें',
    "ai.empty.subtitle":
      "बिक्री पूर्वानुमान, इन्वेंटरी टिप्स, मूल्य रणनीतियाँ, और बहुत कुछ!",

    // Tabs
    "tab.report": "प्रदर्शन रिपोर्ट",
    "tab.forecast": "बिक्री पूर्वानुमान",
    "tab.inventory": "इन्वेंटरी",
    "tab.pricing": "मूल्य निर्धारण",
    "tab.churn": "ग्राहक हानि",
    "tab.india": "भारत इनसाइट्स",

    // Period
    "period.7d": "पिछले 7 दिन",
    "period.30d": "पिछले 30 दिन",
    "period.90d": "पिछले 90 दिन",
    "period.ytd": "वर्ष से अब तक",

    // Store
    "store.all": "सभी स्टोर",
    "store.loading": "स्टोर लोड हो रहे हैं...",

    // Common
    "common.loading": "एनालिटिक्स लोड हो रहा है...",
    "common.error": "डेटा लोड करने में त्रुटि",
    "common.retry": "पुनः प्रयास करें",
    "common.noData": "कोई डेटा उपलब्ध नहीं",
  },

  hinglish: {
    // Header
    "header.title": "Analytics Dashboard",
    "header.subtitle": "Aapke business ka complete overview",

    // KPIs
    "kpi.revenue": "Total Revenue",
    "kpi.orders": "Total Orders",
    "kpi.profit": "Profit",
    "kpi.aov": "Avg Order Value",
    "kpi.margin": "margin",

    // Charts
    "chart.revenue": "Revenue Trend",
    "chart.products": "Top Products",
    "chart.cities": "Top Cities",
    "chart.customers": "Customer Segments",

    // COD
    "cod.title": "COD vs Prepaid Analysis",
    "cod.cash": "Cash on Delivery",
    "cod.prepaid": "Prepaid/Online",
    "cod.orders": "orders",
    "cod.warning": "High COD ratio",
    "cod.tip": "COD percentage kam karne ke liye prepaid discounts try karo!",

    // AI
    "ai.title": "AI Insights",
    "ai.generate": "Insights Generate Karo",
    "ai.generating": "Generate ho raha hai...",
    "ai.empty.title":
      'AI-powered recommendations aur analysis ke liye "Generate Insights" click karo',
    "ai.empty.subtitle":
      "Sales forecast, inventory tips, pricing strategies, aur bahut kuch!",

    // Tabs
    "tab.report": "Performance Report",
    "tab.forecast": "Sales Forecast",
    "tab.inventory": "Inventory",
    "tab.pricing": "Pricing",
    "tab.churn": "Churn",
    "tab.india": "India Insights",

    // Period
    "period.7d": "Last 7 Days",
    "period.30d": "Last 30 Days",
    "period.90d": "Last 90 Days",
    "period.ytd": "Year to Date",

    // Store
    "store.all": "All Stores",
    "store.loading": "Stores load ho rahe hain...",

    // Common
    "common.loading": "Analytics load ho raha hai...",
    "common.error": "Data Load Karne Mein Error",
    "common.retry": "Retry Karo",
    "common.noData": "Koi data available nahi hai",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("hinglish");

  // Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["english", "hindi", "hinglish"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
