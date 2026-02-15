/**
 * LanguageToggle Component
 * Toggle between English, Hindi, and Hinglish
 */

"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { value: "english" as const, label: "English", flag: "🇬🇧" },
    { value: "hindi" as const, label: "हिंदी", flag: "🇮🇳" },
    { value: "hinglish" as const, label: "Hinglish", flag: "🇮🇳" },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Languages className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-gray-700">
          {languages.find((l) => l.value === language)?.flag}{" "}
          {languages.find((l) => l.value === language)?.label}
        </span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => setLanguage(lang.value)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center gap-3 ${
              language === lang.value
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-700"
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.value && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
