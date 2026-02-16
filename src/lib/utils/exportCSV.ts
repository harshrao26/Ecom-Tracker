/**
 * Utility to export data to CSV format
 */

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

export function exportToCSV(
  data: any[],
  columns: ExportColumn[],
  filename: string,
) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Create CSV header
  const headers = columns.map((col) => col.label).join(",");

  // Create CSV rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value = item[col.key];

        // Apply custom formatting if provided
        if (col.format) {
          value = col.format(value);
        }

        // Handle different data types
        if (value === null || value === undefined) {
          return "";
        }

        // Convert to string and escape quotes
        value = String(value).replace(/"/g, '""');

        // Wrap in quotes if contains comma, newline, or quotes
        if (
          value.includes(",") ||
          value.includes("\n") ||
          value.includes('"')
        ) {
          return `"${value}"`;
        }

        return value;
      })
      .join(",");
  });

  // Combine headers and rows
  const csv = [headers, ...rows].join("\n");

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${Date.now()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format helpers for common data types
 */
export const formatters = {
  date: (value: string | Date) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString();
  },

  datetime: (value: string | Date) => {
    if (!value) return "";
    return new Date(value).toLocaleString();
  },

  currency: (value: number, currency = "USD") => {
    if (value === null || value === undefined) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  },

  boolean: (value: boolean) => {
    return value ? "Yes" : "No";
  },

  percentage: (value: number) => {
    if (value === null || value === undefined) return "";
    return `${(value * 100).toFixed(2)}%`;
  },
};
