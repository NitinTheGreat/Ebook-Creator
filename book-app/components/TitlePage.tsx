"use client";

import React from "react";
import { BookSettings, ThemeMode } from "@/types";

const THEME_STYLES: Record<ThemeMode, { text: string; muted: string }> = {
  light: { text: "#1a1a1a", muted: "#666666" },
  sepia: { text: "#2c2416", muted: "#8a7f6e" },
  dark: { text: "#d4d4d4", muted: "#888888" },
};

export default function TitlePage({
  title,
  author,
  subtitle,
  settings,
}: {
  title: string;
  author: string;
  subtitle: string;
  settings: BookSettings;
}) {
  const theme = THEME_STYLES[settings.theme];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* Decorative line */}
      <div className="w-16 h-px mb-8" style={{ backgroundColor: theme.muted }} />

      {/* Title */}
      <h1
        className="font-bold tracking-tight leading-tight"
        style={{
          fontSize: "2em",
          color: theme.text,
          fontFamily: settings.fontFamily,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className="mt-4 italic"
          style={{
            fontSize: "1.1em",
            color: theme.muted,
            fontFamily: settings.fontFamily,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative element */}
      <div className="flex items-center gap-2 my-8">
        <div className="w-8 h-px" style={{ backgroundColor: theme.muted }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.muted }} />
        <div className="w-8 h-px" style={{ backgroundColor: theme.muted }} />
      </div>

      {/* Author */}
      <p
        className="tracking-widest uppercase"
        style={{
          fontSize: "0.85em",
          color: theme.muted,
          fontFamily: settings.fontFamily,
        }}
      >
        {author}
      </p>
    </div>
  );
}
