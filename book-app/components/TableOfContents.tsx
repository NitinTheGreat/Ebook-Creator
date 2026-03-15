"use client";

import React from "react";
import { BookSettings, ThemeMode } from "@/types";

const THEME_STYLES: Record<ThemeMode, { text: string; muted: string; dotColor: string }> = {
  light: { text: "#1a1a1a", muted: "#666666", dotColor: "#ccc" },
  sepia: { text: "#2c2416", muted: "#8a7f6e", dotColor: "#c4b9a8" },
  dark: { text: "#d4d4d4", muted: "#888888", dotColor: "#444" },
};

export interface TocEntry {
  title: string;
  page: number;
}

export default function TableOfContents({
  entries,
  settings,
}: {
  entries: TocEntry[];
  settings: BookSettings;
}) {
  const theme = THEME_STYLES[settings.theme];

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: settings.fontFamily }}>
      <h2
        className="text-center font-bold tracking-wider uppercase mb-6"
        style={{ fontSize: "1.3em", color: theme.text }}
      >
        Contents
      </h2>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-end gap-1">
            <span
              className="shrink-0 font-medium"
              style={{ fontSize: "0.9em", color: theme.text }}
            >
              {entry.title}
            </span>
            <span
              className="flex-1 border-b border-dotted mx-1 mb-1"
              style={{ borderColor: theme.dotColor }}
            />
            <span
              className="shrink-0 tabular-nums"
              style={{ fontSize: "0.85em", color: theme.muted }}
            >
              {entry.page}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
