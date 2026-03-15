"use client";

import React, { useState } from "react";
import { useBookStore } from "@/store/bookStore";
import { tiptapToHtml } from "@/lib/tiptapToText";
import { Download, Loader2 } from "lucide-react";

export default function ExportButton() {
  const { book } = useBookStore();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const sortedChapters = [...book.chapters].sort((a, b) => a.order - b.order);

      // Build print-ready HTML
      const chaptersHtml = sortedChapters
        .map((ch, i) => {
          const html = tiptapToHtml(ch.content);
          return `
            <div class="print-chapter">
              <div class="chapter-body">
                <h1>
                  <span style="display:block;font-size:0.5em;color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8pt;">Chapter ${i + 1}</span>
                  ${ch.title}
                </h1>
                ${html}
              </div>
            </div>
          `;
        })
        .join("");

      const tocHtml = sortedChapters
        .map(
          (ch, i) => `
          <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:8px;font-size:12pt;">
            <span style="font-weight:600;white-space:nowrap;">Chapter ${i + 1} &nbsp; ${ch.title}</span>
            <span style="flex:1;border-bottom:1px dotted #bbb;margin:0 4px;min-width:20px;align-self:flex-end;margin-bottom:3px;"></span>
            <span style="color:#666;white-space:nowrap;font-variant-numeric:tabular-nums;">${i + 3}</span>
          </div>
        `
        )
        .join("");

      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    @page {
      size: 6in 9in;
      margin: 1in 0.75in 1in 1.25in;
    }

    body {
      font-family: "Source Serif 4", Georgia, serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }

    .print-title-page {
      page-break-after: always;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }

    .print-toc {
      page-break-after: always;
      padding-top: 2em;
    }

    .print-chapter {
      page-break-before: always;
    }

    .chapter-body {
      column-count: ${book.settings.columnCount};
      column-gap: ${book.settings.columnGap}px;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      orphans: 3;
      widows: 3;
    }

    .chapter-body h1 {
      column-span: all;
      font-size: 22pt;
      font-weight: 700;
      text-align: center;
      margin: 0 0 16pt;
      letter-spacing: 0.02em;
    }

    .chapter-body h2 {
      font-size: 13pt;
      font-weight: 700;
      margin: 14pt 0 6pt;
      break-after: avoid;
    }

    .chapter-body h3 {
      font-size: 11pt;
      font-weight: 600;
      font-style: italic;
      margin: 10pt 0 4pt;
      break-after: avoid;
    }

    .chapter-body p {
      margin: 0 0 6pt;
      text-indent: 18pt;
      line-height: 1.45;
      font-size: 11pt;
    }

    .chapter-body p:first-child,
    .chapter-body h1 + p,
    .chapter-body h2 + p,
    .chapter-body h3 + p {
      text-indent: 0;
    }

    .chapter-body blockquote {
      border-left: 2pt solid #999;
      padding-left: 12pt;
      margin: 8pt 0;
      font-style: italic;
      color: #555;
    }

    .chapter-body pre {
      background: #f5f5f0;
      border: 0.5pt solid #ccc;
      padding: 8pt;
      font-size: 9pt;
      font-family: "Courier New", monospace;
      break-inside: avoid;
      margin: 6pt 0;
      white-space: pre-wrap;
    }

    .chapter-body ul, .chapter-body ol {
      padding-left: 18pt;
      margin: 4pt 0;
    }

    .chapter-body li {
      margin-bottom: 2pt;
    }
  </style>
</head>
<body>
  <!-- Title Page -->
  <div class="print-title-page">
    <div style="width:80px;height:2px;background:#333;margin-bottom:40px;"></div>
    <h1 style="font-size:28pt;font-weight:700;letter-spacing:0.02em;margin:0 0 8pt;">${book.title}</h1>
    ${book.subtitle ? `<p style="font-size:14pt;font-style:italic;color:#555;margin:0 0 32px;">${book.subtitle}</p>` : ""}
    <div style="display:flex;align-items:center;gap:12px;margin:24px 0;">
      <div style="width:40px;height:1px;background:#999;"></div>
      <div style="width:6px;height:6px;border:1px solid #999;transform:rotate(45deg);"></div>
      <div style="width:40px;height:1px;background:#999;"></div>
    </div>
    <p style="font-size:11pt;letter-spacing:0.25em;text-transform:uppercase;color:#555;font-weight:600;">${book.author}</p>
  </div>

  <!-- Table of Contents -->
  <div class="print-toc">
    <h2 style="text-align:center;font-size:18pt;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:24pt;">Contents</h2>
    ${tocHtml}
  </div>

  <!-- Chapters -->
  ${chaptersHtml}
</body>
</html>`;

      // Send to API for Puppeteer rendering
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fullHtml, title: book.title }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      // Fallback: use window.print()
      handlePrintFallback();
    } finally {
      setExporting(false);
    }
  };

  const handlePrintFallback = () => {
    const sortedChapters = [...book.chapters].sort((a, b) => a.order - b.order);

    const chaptersHtml = sortedChapters
      .map((ch, i) => {
        const html = tiptapToHtml(ch.content);
        return `
          <div style="page-break-before:always;">
            <div style="column-count:${book.settings.columnCount};column-gap:${book.settings.columnGap}px;text-align:justify;hyphens:auto;">
              <h1 style="column-span:all;font-size:22pt;font-weight:700;text-align:center;margin:0 0 16pt;letter-spacing:0.02em;">
                <span style="display:block;font-size:11pt;color:#888;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:8pt;">Chapter ${i + 1}</span>
                ${ch.title}
              </h1>
              ${html}
            </div>
          </div>`;
      })
      .join("");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    @page { size: 6in 9in; margin: 1in 0.75in 1in 1.25in; }
    body { font-family: "Source Serif 4", Georgia, serif; font-size: 11pt; line-height: 1.45; color: #1a1a1a; }
    h2 { font-size: 13pt; font-weight: 700; margin: 14pt 0 6pt; break-after: avoid; }
    h3 { font-size: 11pt; font-weight: 600; font-style: italic; margin: 10pt 0 4pt; break-after: avoid; }
    p { margin: 0 0 6pt; text-indent: 18pt; }
    blockquote { border-left: 2pt solid #999; padding-left: 12pt; font-style: italic; color: #555; }
    pre { background: #f5f5f0; border: 0.5pt solid #ccc; padding: 8pt; font-size: 9pt; font-family: "Courier New", monospace; break-inside: avoid; white-space: pre-wrap; }
    ul, ol { padding-left: 18pt; margin: 4pt 0; }
  </style>
</head>
<body>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;page-break-after:always;">
    <div style="width:80px;height:2px;background:#333;margin-bottom:40px;"></div>
    <h1 style="font-size:28pt;font-weight:700;">${book.title}</h1>
    ${book.subtitle ? `<p style="font-size:14pt;font-style:italic;color:#555;">${book.subtitle}</p>` : ""}
    <p style="margin-top:40px;font-size:11pt;letter-spacing:0.25em;text-transform:uppercase;color:#555;">${book.author}</p>
  </div>
  ${chaptersHtml}
</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

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
