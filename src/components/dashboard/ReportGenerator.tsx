"use client";

import React, { useState } from "react";
import { FiDownload, FiFileText, FiLoader } from "react-icons/fi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReportGeneratorProps {
  userName: string;
  period: string;
  dashboardId: string; // The ID of the element to capture
}

export default function ReportGenerator({
  userName,
  period,
  dashboardId,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    const dashboardElement = document.getElementById(dashboardId);
    if (!dashboardElement) return;

    setIsGenerating(true);

    try {
      // Capture the element
      const canvas = await html2canvas(dashboardElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#f9fafb", // Match dashboard bg
        onclone: (clonedDoc) => {
          // Hide elements that shouldn't be in the PDF
          const hideInPdf = clonedDoc.querySelectorAll(".hide-in-pdf");
          hideInPdf.forEach(
            (el) => ((el as HTMLElement).style.display = "none"),
          );

          // Ensure elements are visible
          const showInPdf = clonedDoc.querySelectorAll(".show-in-pdf");
          showInPdf.forEach(
            (el) => ((el as HTMLElement).style.display = "block"),
          );
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Add a header/branding manually in PDF for premium feel
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, width, 40, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("ONLINE PLANET - PERFORMANCE REPORT", 20, 25);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Agent: ${userName} | Period: ${period} | Exported: ${new Date().toLocaleString()}`,
        width - 20,
        25,
        { align: "right" },
      );

      // Add the dashboard image
      pdf.addImage(imgData, "PNG", 0, 40, width, height - 40);

      // Save the PDF
      pdf.save(`Online_Planet_Report_${period.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <FiLoader className="animate-spin" size={14} />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FiFileText size={14} />
          <span>Export PDF</span>
        </>
      )}
    </button>
  );
}
