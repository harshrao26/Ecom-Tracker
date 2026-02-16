"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  FiFileText,
  FiDownload,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiTrendingUp,
  FiBarChart,
  FiPieChart,
} from "react-icons/fi";
import { generatePDFReport, PDFReportData } from "@/lib/utils/generatePDF";
import { exportToCSV, formatters, ExportColumn } from "@/lib/utils/exportCSV";
import DateRangePicker from "@/components/ui/DateRangePicker";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: "user" | "revenue" | "analytics" | "activity";
  formats: ("PDF" | "CSV")[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "user-activity",
    name: "User Activity Report",
    description: "Detailed user engagement and activity metrics",
    icon: <FiUsers className="text-blue-600" size={24} />,
    type: "user",
    formats: ["PDF", "CSV"],
  },
  {
    id: "revenue-summary",
    name: "Revenue Summary",
    description: "Complete revenue breakdown and financial metrics",
    icon: <FiDollarSign className="text-green-600" size={24} />,
    type: "revenue",
    formats: ["PDF", "CSV"],
  },
  {
    id: "analytics-overview",
    name: "Analytics Overview",
    description: "Traffic, sessions, and conversion analytics",
    icon: <FiActivity className="text-purple-600" size={24} />,
    type: "analytics",
    formats: ["PDF", "CSV"],
  },
  {
    id: "growth-metrics",
    name: "Growth Metrics",
    description: "User growth, retention, and churn analysis",
    icon: <FiTrendingUp className="text-orange-600" size={24} />,
    type: "activity",
    formats: ["PDF", "CSV"],
  },
  {
    id: "subscription-report",
    name: "Subscription Report",
    description: "Active subscriptions, MRR, and plan distribution",
    icon: <FiBarChart className="text-indigo-600" size={24} />,
    type: "revenue",
    formats: ["PDF", "CSV"],
  },
  {
    id: "performance-dashboard",
    name: "Performance Dashboard",
    description: "KPIs and key business metrics snapshot",
    icon: <FiPieChart className="text-pink-600" size={24} />,
    type: "analytics",
    formats: ["PDF"],
  },
];

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const [generating, setGenerating] = useState(false);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const handleGenerateReport = async (
    reportId: string,
    format: "PDF" | "CSV",
  ) => {
    setGenerating(true);
    setSelectedReport(reportId);

    try {
      // Fetch report data
      const response = await fetch(
        `/api/admin/reports/${reportId}?startDate=${dateRange?.start.toISOString()}&endDate=${dateRange?.end.toISOString()}`,
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to generate report");
      }

      const reportData = result.data;

      if (format === "PDF") {
        // Generate PDF
        const template = reportTemplates.find((t) => t.id === reportId);
        const pdfData: PDFReportData = {
          title: template?.name || "Report",
          dateRange: dateRange
            ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
            : "All Time",
          stats: reportData.stats || [],
          tables: reportData.tables || [],
          charts: reportData.charts || [],
        };

        generatePDFReport(pdfData);
      } else if (format === "CSV") {
        // Generate CSV
        if (reportData.csvData && reportData.csvColumns) {
          exportToCSV(reportData.csvData, reportData.csvColumns, reportId);
        }
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setGenerating(false);
      setSelectedReport(null);
    }
  };

  return (
    <>
      <AdminSidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <FiFileText className="text-indigo-600" />
              Reports & Insights
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Generate comprehensive reports and export data
            </p>
          </div>

          {/* Date Range Selector */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              Select Date Range
            </h3>
            <DateRangePicker
              onDateRangeChange={handleDateRangeChange}
              initialPreset="30d"
            />
          </div>

          {/* Report Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {template.formats.map((format) => (
                      <button
                        key={format}
                        onClick={() =>
                          handleGenerateReport(template.id, format)
                        }
                        disabled={
                          !dateRange ||
                          (generating && selectedReport === template.id)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          generating && selectedReport === template.id
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : !dateRange
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : format === "PDF"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {generating && selectedReport === template.id ? (
                          <span className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                            Generating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FiDownload size={12} />
                            {format}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500">{template.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        template.type === "user"
                          ? "bg-blue-50 text-blue-600"
                          : template.type === "revenue"
                            ? "bg-green-50 text-green-600"
                            : template.type === "analytics"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {template.type.charAt(0).toUpperCase() +
                        template.type.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Available in {template.formats.join(" & ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="text-lg font-black text-blue-900 mb-3">
              📊 How to Use Reports
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">1.</span>
                <span>
                  Select a date range using the presets or custom date picker
                  above
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">2.</span>
                <span>
                  Choose a report template based on the insights you need
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">3.</span>
                <span>
                  Click PDF for formatted reports with charts, or CSV for raw
                  data analysis
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">4.</span>
                <span>
                  Your report will be automatically downloaded to your device
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <FiFileText className="text-blue-600" size={24} />
              </div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Total Reports
              </h4>
              <p className="text-3xl font-black text-gray-900">
                {reportTemplates.length}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <FiDownload className="text-green-600" size={24} />
              </div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Export Formats
              </h4>
              <p className="text-3xl font-black text-gray-900">2</p>
              <p className="text-xs text-gray-500 mt-1">PDF & CSV</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <FiBarChart className="text-purple-600" size={24} />
              </div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Data Types
              </h4>
              <p className="text-3xl font-black text-gray-900">4</p>
              <p className="text-xs text-gray-500 mt-1">Categories</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <FiActivity className="text-orange-600" size={24} />
              </div>
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Date Range
              </h4>
              <p className="text-xl font-black text-gray-900">
                {dateRange ? "Selected" : "Not Set"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dateRange
                  ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                  : "Select above"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
