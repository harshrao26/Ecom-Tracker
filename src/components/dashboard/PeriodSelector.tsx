/**
 * PeriodSelector Component
 * Dropdown to select time period
 */

'use client';

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium cursor-pointer hover:border-gray-400 transition-colors"
    >
      {periods.map((period) => (
        <option key={period.value} value={period.value}>
          {period.label}
        </option>
      ))}
    </select>
  );
}
