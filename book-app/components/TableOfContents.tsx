"use client";

import React from "react";
import { BookSettings } from "@/types";

export interface TocEntry {
  chapterNumber: number;
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
  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: `"${settings.fontFamily}", Georgia, serif` }}
    >
      <h2
        className="text-center font-bold tracking-[0.2em] uppercase mb-8"
        style={{ fontSize: "1.3em", color: "#1a1a1a" }}
      >
        Contents
      </h2>

      <div className="space-y-1.5">
        {entries.map((entry, i) => (
          <div key={i} className="toc-entry" style={{ fontSize: "0.95em" }}>
            <span className="toc-title" style={{ color: "#1a1a1a" }}>
              Chapter {entry.chapterNumber}
              <span className="font-normal ml-2" style={{ color: "#333" }}>
                {entry.title}
              </span>
            </span>
            <span className="toc-dots" />
            <span className="toc-page">{entry.page}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
