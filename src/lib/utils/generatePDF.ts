import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFReportData {
  title: string;
  dateRange: string;
  stats: Array<{ label: string; value: string | number }>;
  tables?: Array<{
    title: string;
    headers: string[];
    rows: string[][];
  }>;
  charts?: Array<{
    title: string;
    imageDataUrl: string; // Base64 image
  }>;
}

/**
 * Generate a PDF report with stats, tables, and charts
 */
export function generatePDFReport(data: PDFReportData) {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.title, 20, yPosition);
  yPosition += 10;

  // Date Range
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(data.dateRange, 20, yPosition);
  yPosition += 15;

  // Stats Cards
  if (data.stats && data.stats.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Key Metrics", 20, yPosition);
    yPosition += 8;

    const statsPerRow = 3;
    const cardWidth = 50;
    const cardHeight = 20;

    data.stats.forEach((stat, index) => {
      const row = Math.floor(index / statsPerRow);
      const col = index % statsPerRow;
      const x = 20 + col * (cardWidth + 10);
      const y = yPosition + row * (cardHeight + 5);

      // Background
      doc.setFillColor(249, 250, 251);
      doc.rect(x, y, cardWidth, cardHeight, "F");

      // Label
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(stat.label, x + 5, y + 8);

      // Value
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(String(stat.value), x + 5, y + 16);
    });

    yPosition +=
      Math.ceil(data.stats.length / statsPerRow) * (cardHeight + 5) + 10;
  }

  // Tables
  if (data.tables && data.tables.length > 0) {
    data.tables.forEach((table) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(table.title, 20, yPosition);
      yPosition += 5;

      autoTable(doc, {
        head: [table.headers],
        body: table.rows,
        startY: yPosition,
        theme: "grid",
        headStyles: {
          fillColor: [99, 102, 241], // Indigo
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    });
  }

  // Charts (as images)
  if (data.charts && data.charts.length > 0) {
    data.charts.forEach((chart) => {
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(chart.title, 20, yPosition);
      yPosition += 5;

      // Add chart image
      try {
        doc.addImage(chart.imageDataUrl, "PNG", 20, yPosition, 170, 80);
        yPosition += 90;
      } catch (error) {
        console.error("Error adding chart image:", error);
      }
    });
  }

  // Footer with timestamp
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
      20,
      285,
    );
  }

  // Download
  doc.save(`${data.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
}

/**
 * Convert a DOM element (like a chart) to base64 image
 */
export async function elementToBase64(element: HTMLElement): Promise<string> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
  });
  return canvas.toDataURL("image/png");
}
