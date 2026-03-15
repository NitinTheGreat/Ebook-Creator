import { JSONContent } from "@tiptap/react";

export interface Chapter {
  id: string;
  title: string;
  content: JSONContent;
  order: number;
}

export type PageSize = "A4" | "A5" | "6x9";
export type ThemeMode = "light" | "sepia" | "dark";

export interface PageDimensions {
  width: number; // in points (1pt = 1/72 inch)
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

export interface BookSettings {
  pageSize: PageSize;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  theme: ThemeMode;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
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

export const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  A4: { width: 595, height: 842, label: "A4 (210 × 297mm)" },
  A5: { width: 420, height: 595, label: "A5 (148 × 210mm)" },
  "6x9": { width: 432, height: 648, label: '6" × 9" (Trade)' },
};

export const DEFAULT_SETTINGS: BookSettings = {
  pageSize: "6x9",
  fontFamily: "Georgia",
  fontSize: 12,
  lineHeight: 1.6,
  theme: "light",
  margins: { top: 72, bottom: 72, left: 72, right: 72 },
};

export const FONT_OPTIONS = [
  { value: "Georgia", label: "Georgia (Serif)" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Garamond", label: "Garamond" },
  { value: "Palatino", label: "Palatino" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Inter", label: "Inter (Sans)" },
  { value: "Roboto", label: "Roboto (Sans)" },
];
