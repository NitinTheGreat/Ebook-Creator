import { JSONContent } from "@tiptap/react";

export interface Chapter {
  id: string;
  title: string;
  content: JSONContent;
  order: number;
}

export type PageSize = "A4" | "6x9";
export type ThemeMode = "light" | "sepia" | "dark";

export interface BookSettings {
  pageSize: PageSize;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  theme: ThemeMode;
  columnCount: 1 | 2;
  columnGap: number;
  margins: {
    top: number;
    bottom: number;
    inner: number;
    outer: number;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subtitle: string;
  chapters: Chapter[];
  settings: BookSettings;
  createdAt: string;
  updatedAt: string;
}

export const PAGE_SIZES: Record<
  PageSize,
  { width: number; height: number; label: string; cssWidth: string; cssHeight: string }
> = {
  A4: {
    width: 210,
    height: 297,
    label: "A4 (210 × 297 mm)",
    cssWidth: "210mm",
    cssHeight: "297mm",
  },
  "6x9": {
    width: 152.4,
    height: 228.6,
    label: '6" × 9" (Trade)',
    cssWidth: "6in",
    cssHeight: "9in",
  },
};

export const DEFAULT_SETTINGS: BookSettings = {
  pageSize: "6x9",
  fontFamily: "Source Serif 4",
  fontSize: 11,
  lineHeight: 1.45,
  theme: "light",
  columnCount: 2,
  columnGap: 26,
  margins: {
    top: 72,    // 1 inch
    bottom: 72, // 1 inch
    inner: 90,  // 1.25 inch
    outer: 54,  // 0.75 inch
  },
};

export const FONT_OPTIONS = [
  { value: "Source Serif 4", label: "Source Serif 4" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Palatino", label: "Palatino" },
  { value: "Garamond", label: "Garamond" },
];
