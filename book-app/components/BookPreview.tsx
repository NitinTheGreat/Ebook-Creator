"use client";

import React, { useState, useMemo } from "react";
import { useBookStore } from "@/store/bookStore";
import PageRenderer from "./PageRenderer";
import TitlePage from "./TitlePage";
import TableOfContents, { TocEntry } from "./TableOfContents";
import { tiptapToHtml } from "@/lib/tiptapToText";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookPreview() {
  const { book, showPreview, setShowPreview } = useBookStore();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    const allPages: { node: React.ReactNode; chapterTitle?: string; isTitle?: boolean }[] = [];
    const sortedChapters = [...book.chapters].sort((a, b) => a.order - b.order);

    // Page 1: Title page
    allPages.push({
      node: (
        <TitlePage
          title={book.title}
          author={book.author}
          subtitle={book.subtitle}
          settings={book.settings}
        />
      ),
      isTitle: true,
    });

    // Page 2: TOC
    const tocEntries: TocEntry[] = sortedChapters.map((ch, i) => ({
      chapterNumber: i + 1,
      title: ch.title,
      page: 3 + i, // simple page number estimate
    }));

    allPages.push({
      node: (
        <TableOfContents entries={tocEntries} settings={book.settings} />
      ),
    });

    // Chapter pages
    for (let i = 0; i < sortedChapters.length; i++) {
      const chapter = sortedChapters[i];
      const html = tiptapToHtml(chapter.content);
      const chapterNum = i + 1;

      allPages.push({
        node: (
          <div key={chapter.id}>
            <h1
              style={{
                fontFamily: `"${book.settings.fontFamily}", Georgia, serif`,
                fontSize: "1.9em",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "0.5em",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
                color: "#1a1a1a",
              }}
            >
              <span style={{ display: "block", fontSize: "0.6em", color: "#888", marginBottom: "0.3em", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Chapter {chapterNum}
              </span>
              {chapter.title}
            </h1>
            <div
              className="chapter-content-preview"
              style={{
                fontFamily: `"${book.settings.fontFamily}", Georgia, serif`,
                fontSize: "1em",
                lineHeight: book.settings.lineHeight,
                textAlign: "justify",
                hyphens: "auto",
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ),
        chapterTitle: chapter.title,
      });
    }

    return allPages;
  }, [book]);

  if (!showPreview) return null;

  const totalPages = pages.length;
  const current = pages[currentPage];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/95 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-200">📖 Academic Book Preview</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 tabular-nums">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            className="text-zinc-400 hover:text-red-400 transition-colors"
            onClick={() => { setCurrentPage(0); setShowPreview(false); }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden py-6 gap-4">
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
          chapterTitle={current?.chapterTitle}
          settings={book.settings}
          isTitle={current?.isTitle}
        >
          {current?.node}
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
      <div className="flex items-center justify-center gap-1.5 pb-4 flex-wrap max-w-xl mx-auto">
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
