"use client";

import React, { useState, useMemo } from "react";
import { useBookStore } from "@/store/bookStore";
import PageRenderer from "./PageRenderer";
import TitlePage from "./TitlePage";
import TableOfContents, { TocEntry } from "./TableOfContents";
import { tiptapToHtml } from "@/lib/tiptapToText";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

export default function BookPreview() {
  const { book, showPreview, setShowPreview } = useBookStore();
  const [currentPage, setCurrentPage] = useState(0);

  // Build pages: title page + TOC + chapter pages
  const pages = useMemo(() => {
    const allPages: React.ReactNode[] = [];

    // Page 1: Title page
    allPages.push(
      <TitlePage
        key="title"
        title={book.title}
        author={book.author}
        subtitle={book.subtitle}
        settings={book.settings}
      />
    );

    // Calculate TOC entries: each chapter starts on its own page
    // Page 1 = title, Page 2 = TOC, chapters start at page 3+
    const tocEntries: TocEntry[] = [];
    let pageNum = 3; // first chapter page number
    for (const chapter of book.chapters.sort((a, b) => a.order - b.order)) {
      tocEntries.push({ title: chapter.title, page: pageNum });
      // Estimate pages per chapter (simple: 1 page per chapter for TOC)
      pageNum += 1;
    }

    // Page 2: TOC
    allPages.push(
      <TableOfContents
        key="toc"
        entries={tocEntries}
        settings={book.settings}
      />
    );

    // Chapter pages
    for (const chapter of book.chapters.sort((a, b) => a.order - b.order)) {
      const html = tiptapToHtml(chapter.content);
      allPages.push(
        <div key={chapter.id}>
          <h2
            className="text-center font-bold mb-6 tracking-wide"
            style={{
              fontSize: "1.5em",
              fontFamily: book.settings.fontFamily,
            }}
          >
            {chapter.title}
          </h2>
          <div
            className="chapter-content"
            style={{
              fontFamily: book.settings.fontFamily,
              fontSize: "1em",
              lineHeight: book.settings.lineHeight,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    }

    return allPages;
  }, [book]);

  if (!showPreview) return null;

  const totalPages = pages.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/90 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          📖 Book Preview
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className="text-zinc-400 hover:text-red-400 transition-colors"
            onClick={() => setShowPreview(false)}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden py-8">
        <button
          className="p-3 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-20"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={32} />
        </button>

        <PageRenderer
          pageNumber={currentPage === 0 ? undefined : currentPage + 1}
          bookTitle={book.title}
          settings={book.settings}
          isTitle={currentPage === 0}
        >
          {pages[currentPage]}
        </PageRenderer>

        <button
          className="p-3 text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-20"
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {pages.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentPage ? "bg-indigo-500 scale-125" : "bg-zinc-700 hover:bg-zinc-500"
            }`}
            onClick={() => setCurrentPage(i)}
          />
        ))}
      </div>
    </div>
  );
}
