"use client";

import React, { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { useBookStore } from "@/store/bookStore";
import PDFDocument from "./pdf/PDFDocument";
import { Download, Loader2 } from "lucide-react";

export default function ExportButton() {
  const { book } = useBookStore();
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const doc = <PDFDocument book={book} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  }, [book]);

  return (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} />
          Export PDF
        </>
      )}
    </button>
  );
}
