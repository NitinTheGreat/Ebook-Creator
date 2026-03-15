"use client";

import React, { useEffect, useState } from "react";
import { useBookStore } from "@/store/bookStore";
import ChapterSidebar from "@/components/ChapterSidebar";
import ChapterEditor from "@/components/ChapterEditor";
import SettingsPanel from "@/components/SettingsPanel";
import BookPreview from "@/components/BookPreview";
import ExportButton from "@/components/ExportButton";
import { Eye, BookOpen, PanelRightClose, PanelRightOpen } from "lucide-react";

export default function Home() {
  const { book, togglePreview, activeChapterId, setActiveChapter } = useBookStore();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Hydration guard for Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default select first chapter
  useEffect(() => {
    if (mounted && !activeChapterId && book.chapters.length > 0) {
      setActiveChapter(book.chapters[0].id);
    }
  }, [mounted, activeChapterId, book.chapters, setActiveChapter]);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0c0c0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm animate-pulse">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0c0c0f]">
      {/* Top Bar */}
      <header className="h-13 shrink-0 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800/80 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <h1 className="text-sm font-bold text-zinc-100 tracking-tight">
              Ebook Creator
            </h1>
          </div>
          <div className="w-px h-5 bg-zinc-700/60" />
          <span className="text-xs text-zinc-500 truncate max-w-[200px]">
            {book.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
            onClick={togglePreview}
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all"
            onClick={() => setSettingsOpen(!settingsOpen)}
            title={settingsOpen ? "Hide Settings" : "Show Settings"}
          >
            {settingsOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </button>
          <ExportButton />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <ChapterSidebar />
        <ChapterEditor />
        {settingsOpen && <SettingsPanel />}
      </div>

      {/* Preview Modal */}
      <BookPreview />
    </div>
  );
}
