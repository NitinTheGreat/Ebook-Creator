"use client";

import React from "react";
import { PAGE_SIZES, BookSettings, ThemeMode } from "@/types";

const THEME_STYLES: Record<ThemeMode, { bg: string; text: string; headerText: string }> = {
  light: { bg: "#FFFFFF", text: "#1a1a1a", headerText: "#666666" },
  sepia: { bg: "#F5F0E8", text: "#2c2416", headerText: "#8a7f6e" },
  dark: { bg: "#1e1e1e", text: "#d4d4d4", headerText: "#666666" },
};

export default function PageRenderer({
  pageNumber,
  bookTitle,
  settings,
  children,
  isTitle = false,
}: {
  pageNumber?: number;
  bookTitle: string;
  settings: BookSettings;
  children: React.ReactNode;
  isTitle?: boolean;
}) {
  const dims = PAGE_SIZES[settings.pageSize];
  const theme = THEME_STYLES[settings.theme];
  const scale = 0.75; // scale down for preview

  return (
    <div
      className="relative shadow-2xl shadow-black/40 mx-auto shrink-0"
      style={{
        width: dims.width * scale,
        height: dims.height * scale,
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize * scale,
        lineHeight: settings.lineHeight,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {/* Running Header */}
      {!isTitle && pageNumber && pageNumber > 1 && (
        <div
          className="absolute top-0 left-0 right-0 text-center text-[10px] tracking-widest uppercase"
          style={{
            color: theme.headerText,
            paddingTop: settings.margins.top * scale * 0.3,
            fontSize: 8 * scale,
          }}
        >
          {bookTitle}
        </div>
      )}

      {/* Content Area */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: settings.margins.top * scale,
          left: settings.margins.left * scale,
          right: settings.margins.right * scale,
          bottom: settings.margins.bottom * scale,
        }}
      >
        {children}
      </div>

      {/* Footer with page number */}
      {!isTitle && pageNumber && (
        <div
          className="absolute bottom-0 left-0 right-0 text-center"
          style={{
            color: theme.headerText,
            paddingBottom: settings.margins.bottom * scale * 0.3,
            fontSize: 9 * scale,
          }}
        >
          {pageNumber}
        </div>
      )}
    </div>
  );
}
