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
    title: "Software Engineering",
    author: "Author Name",
    subtitle: "Principles and Practice",
    chapters: [
      {
        id: firstChapterId,
        title: "Introduction",
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "1.1 What is Software Engineering?" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Software engineering is a systematic, disciplined, and quantifiable approach to the development, operation, and maintenance of software. It encompasses a collection of concepts, methodologies, and tools that enable professionals to build high-quality software systems within time and budget constraints.",
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The field emerged in the late 1960s in response to the software crisis—a period marked by projects that were over budget, behind schedule, and riddled with defects. Since then, software engineering has evolved into a rich discipline with established practices for requirements analysis, system design, implementation, testing, and maintenance.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "1.2 The Software Process" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "A software process is a structured set of activities required to develop a software system. There are many different software processes, but all must include four fundamental activities: software specification, software development, software validation, and software evolution. These activities are organized differently in different development processes.",
                },
              ],
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
        const chapterNum = get().book.chapters.length + 1;
        const newChapter: Chapter = {
          id: uuidv4(),
          title: `Chapter ${chapterNum}`,
          content: {
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: `${chapterNum}.1 Section Title` }],
              },
              {
                type: "paragraph",
                content: [{ type: "text", text: "Start writing here..." }],
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
