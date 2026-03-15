"use client";

import React from "react";
import { PAGE_SIZES, BookSettings } from "@/types";

export default function PageRenderer({
  pageNumber,
  bookTitle,
  chapterTitle,
  settings,
  children,
  isTitle = false,
}: {
  pageNumber?: number;
  bookTitle: string;
  chapterTitle?: string;
  settings: BookSettings;
  children: React.ReactNode;
  isTitle?: boolean;
}) {
  const dims = PAGE_SIZES[settings.pageSize];
  const scale = 0.7;
  const widthPx = dims.width * 3.78 * scale;   // mm to px at 96dpi approx
  const heightPx = dims.height * 3.78 * scale;
  const isEvenPage = pageNumber ? pageNumber % 2 === 0 : false;

  // Inner/outer margin mapping
  const marginLeft = isEvenPage ? settings.margins.outer : settings.margins.inner;
  const marginRight = isEvenPage ? settings.margins.inner : settings.margins.outer;

  return (
    <div
      className="book-page"
      style={{
        width: widthPx,
        height: heightPx,
        borderRadius: 3,
      }}
    >
      {/* Running header */}
      {!isTitle && pageNumber && pageNumber > 2 && (
        <div
          className="book-header"
          style={{
            paddingTop: settings.margins.top * scale * 0.35,
            paddingLeft: marginLeft * scale,
            paddingRight: marginRight * scale,
            textAlign: isEvenPage ? "left" : "right",
          }}
        >
          {isEvenPage ? chapterTitle || bookTitle : bookTitle}
        </div>
      )}

      {/* Content area */}
      <div
        className={`book-page-content ${settings.columnCount === 2 && !isTitle ? "two-column" : ""}`}
        style={{
          position: "absolute",
          top: settings.margins.top * scale,
          bottom: settings.margins.bottom * scale,
          left: marginLeft * scale,
          right: marginRight * scale,
          fontSize: settings.fontSize * scale,
          lineHeight: settings.lineHeight,
          fontFamily: `"${settings.fontFamily}", Georgia, serif`,
          columnGap: settings.columnGap * scale,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* Footer page number */}
      {!isTitle && pageNumber && (
        <div
          className="book-footer"
          style={{
            paddingBottom: settings.margins.bottom * scale * 0.35,
          }}
        >
          {pageNumber}
        </div>
      )}
    </div>
  );
}
