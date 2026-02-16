"use client";

import React, { useState } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  initialPreset?: string;
}

const presets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Custom", value: "custom" },
];

export default function DateRangePicker({
  onDateRangeChange,
  initialPreset = "30d",
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const getDateRange = (preset: string): { start: Date; end: Date } => {
    const now = new Date();

    switch (preset) {
      case "today":
        return {
          start: startOfDay(now),
          end: endOfDay(now),
        };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday),
        };
      case "7d":
        return {
          start: startOfDay(subDays(now, 7)),
          end: endOfDay(now),
        };
      case "30d":
        return {
          start: startOfDay(subDays(now, 30)),
          end: endOfDay(now),
        };
      case "thisMonth":
        return {
          start: startOfMonth(now),
          end: endOfDay(now),
        };
      case "lastMonth":
        const lastMonth = subMonths(now, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      default:
        return {
          start: startOfDay(subDays(now, 30)),
          end: endOfDay(now),
        };
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);

    if (preset === "custom") {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      const { start, end } = getDateRange(preset);
      onDateRangeChange(start, end);
    }
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      const start = startOfDay(new Date(customStartDate));
      const end = endOfDay(new Date(customEndDate));
      onDateRangeChange(start, end);
      setShowCustomPicker(false);
    }
  };

  const getCurrentDateLabel = () => {
    if (selectedPreset === "custom" && customStartDate && customEndDate) {
      return `${format(new Date(customStartDate), "MMM d")} - ${format(new Date(customEndDate), "MMM d, yyyy")}`;
    }
    const preset = presets.find((p) => p.value === selectedPreset);
    return preset?.label || "Select Range";
  };

  return (
    <div className="relative">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetChange(preset.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              selectedPreset === preset.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm text-gray-600">
          <FiCalendar size={16} />
          <span className="font-medium">{getCurrentDateLabel()}</span>
        </div>
      </div>

      {/* Custom Date Picker Modal */}
      {showCustomPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">
                Custom Date Range
              </h3>
              <button
                onClick={() => setShowCustomPicker(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCustomApply}
                  disabled={!customStartDate || !customEndDate}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowCustomPicker(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
