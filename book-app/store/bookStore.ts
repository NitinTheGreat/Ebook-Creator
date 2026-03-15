"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { JSONContent } from "@tiptap/react";
import { Book, BookSettings, Chapter, DEFAULT_SETTINGS } from "@/types";

interface BookState {
  book: Book;
  activeChapterId: string | null;
  showPreview: boolean;

  // Book meta
  setTitle: (title: string) => void;
  setAuthor: (author: string) => void;
  setSubtitle: (subtitle: string) => void;

  // Chapters
  addChapter: () => void;
  deleteChapter: (id: string) => void;
  renameChapter: (id: string, title: string) => void;
  reorderChapters: (chapters: Chapter[]) => void;
  updateChapterContent: (id: string, content: JSONContent) => void;
  setActiveChapter: (id: string | null) => void;

  // Settings
  updateSettings: (settings: Partial<BookSettings>) => void;

  // Preview
  togglePreview: () => void;
  setShowPreview: (show: boolean) => void;
}

const createDefaultBook = (): Book => {
  const firstChapterId = uuidv4();
  return {
    id: uuidv4(),
    title: "My Ebook",
    author: "Author Name",
    subtitle: "",
    chapters: [
      {
        id: firstChapterId,
        title: "Chapter 1",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Start writing your chapter here..." }],
            },
          ],
        },
        order: 0,
      },
    ],
    settings: DEFAULT_SETTINGS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      book: createDefaultBook(),
      activeChapterId: null,
      showPreview: false,

      setTitle: (title) =>
        set((state) => ({
          book: { ...state.book, title, updatedAt: new Date().toISOString() },
        })),

      setAuthor: (author) =>
        set((state) => ({
          book: { ...state.book, author, updatedAt: new Date().toISOString() },
        })),

      setSubtitle: (subtitle) =>
        set((state) => ({
          book: { ...state.book, subtitle, updatedAt: new Date().toISOString() },
        })),

      addChapter: () => {
        const newChapter: Chapter = {
          id: uuidv4(),
          title: `Chapter ${get().book.chapters.length + 1}`,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "" }],
              },
            ],
          },
          order: get().book.chapters.length,
        };
        set((state) => ({
          book: {
            ...state.book,
            chapters: [...state.book.chapters, newChapter],
            updatedAt: new Date().toISOString(),
          },
          activeChapterId: newChapter.id,
        }));
      },

      deleteChapter: (id) =>
        set((state) => {
          const chapters = state.book.chapters
            .filter((c) => c.id !== id)
            .map((c, i) => ({ ...c, order: i }));
          const activeChapterId =
            state.activeChapterId === id
              ? chapters.length > 0
                ? chapters[0].id
                : null
              : state.activeChapterId;
          return {
            book: { ...state.book, chapters, updatedAt: new Date().toISOString() },
            activeChapterId,
          };
        }),

      renameChapter: (id, title) =>
        set((state) => ({
          book: {
            ...state.book,
            chapters: state.book.chapters.map((c) => (c.id === id ? { ...c, title } : c)),
            updatedAt: new Date().toISOString(),
          },
        })),

      reorderChapters: (chapters) =>
        set((state) => ({
          book: {
            ...state.book,
            chapters: chapters.map((c, i) => ({ ...c, order: i })),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateChapterContent: (id, content) =>
        set((state) => ({
          book: {
            ...state.book,
            chapters: state.book.chapters.map((c) => (c.id === id ? { ...c, content } : c)),
            updatedAt: new Date().toISOString(),
          },
        })),

      setActiveChapter: (id) => set({ activeChapterId: id }),

      updateSettings: (settings) =>
        set((state) => ({
          book: {
            ...state.book,
            settings: { ...state.book.settings, ...settings },
            updatedAt: new Date().toISOString(),
          },
        })),

      togglePreview: () => set((state) => ({ showPreview: !state.showPreview })),
      setShowPreview: (show) => set({ showPreview: show }),
    }),
    {
      name: "ebook-creator-storage",
    }
  )
);
